// services/firebase/FirestoreService.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  onSnapshot,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export class FirestoreService<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private getCollectionRef() {
    return collection(db, this.collectionName);
  }

  private getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  // CRUD Operations
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(this.getCollectionRef(), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  async getById(id: string): Promise<T | null> {
    const docSnap = await getDoc(this.getDocRef(id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    const q = query(this.getCollectionRef(), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(this.getDocRef(id), {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.getDocRef(id));
  }

  // Real-time subscriptions
  subscribe(callback: (data: T[]) => void): () => void {
    return onSnapshot(this.getCollectionRef(), (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
      callback(data);
    });
  }

  subscribeToDoc(id: string, callback: (data: T | null) => void): () => void {
    return onSnapshot(this.getDocRef(id), (docSnapshot) => {
      if (!docSnapshot.exists()) {
        callback(null);
        return;
      }
      callback({ id: docSnapshot.id, ...docSnapshot.data() } as T);
    });
  }

  // Advanced queries
  async queryByField(field: string, operator: any, value: any): Promise<T[]> {
    const q = query(this.getCollectionRef(), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  }
}