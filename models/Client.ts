export type ClientStatus = 'lead' | 'active' | 'inactive';

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  industry: string;
  status: ClientStatus;
  location: string;
}