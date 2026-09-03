// app/index.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from '../theme';

// Screens
import { LoginScreen } from './auth/login';
import { RegisterScreen } from './auth/register';
import { DashboardScreen } from './tabs/dashboard';
import { CampaignsScreen } from './tabs/campaigns';
import { ClientsScreen } from './tabs/clients';
import { SettingsScreen } from './tabs/settings';
import { CampaignDetailScreen } from './screens/campaigns/CampaignDetail';
import { CreateCampaignScreen } from './screens/campaigns/CreateCampaign';
import { ClientDetailScreen } from './screens/clients/ClientDetail';

// Components
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AIAssistant } from '../components/ai/AIAssistant';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        headerShown: false
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Campaigns" component={CampaignsScreen} />
      <Tab.Screen name="Clients" component={ClientsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CampaignDetail" 
              component={CampaignDetailScreen}
              options={{ title: 'Campaign Details' }}
            />
            <Stack.Screen 
              name="CreateCampaign" 
              component={CreateCampaignScreen}
              options={{ title: 'Create Campaign' }}
            />
            <Stack.Screen 
              name="ClientDetail" 
              component={ClientDetailScreen}
              options={{ title: 'Client Details' }}
            />
          </>
        )}
      </Stack.Navigator>
      
      {/* Floating AI Assistant */}
      {user && <AIAssistant />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}