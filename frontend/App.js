// frontend/App.js

import React, { useContext } from 'react'; // <-- Change imports
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

// --- CHANGE IMPORTS ---
import { AuthProvider, AuthContext } from './src/context/AuthContext'; // Import both
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
// --- END IMPORTS ---

// This inner component is now the one that consumes the context.
const AppNav = () => {
    // We get the state FROM the context provider.
    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size={'large'} /></View>;
    }

    return userToken !== null ? <AppNavigator /> : <AuthNavigator />;
}


// The root App component now has only one job: provide the context.
export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNav />
            </NavigationContainer>
        </AuthProvider>
    );
}