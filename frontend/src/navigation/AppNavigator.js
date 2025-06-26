// frontend/src/navigation/AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import all four screens
import DashboardScreen from '../screens/DashboardScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen} 
                options={{ title: 'My Habits' }} 
            />
            <Stack.Screen 
                name="CreateHabit" 
                component={CreateHabitScreen} 
                options={{ title: 'Create a New Habit' }} 
            />
            <Stack.Screen 
                name="EditHabit" 
                component={EditHabitScreen} 
                options={{ title: 'Edit Habit' }} 
            />
            {/* This is the line that registers the Progress screen */}
            <Stack.Screen 
                name="Progress" 
                component={ProgressScreen} 
                options={{ title: 'Habit Progress' }} 
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;