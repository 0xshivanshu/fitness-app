// frontend/src/screens/ProgressScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is a standard functional React component.
const ProgressScreen = ({ route }) => {
    // Get the habitId and habitName that were passed during navigation
    const { habitId, habitName } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [progressData, setProgressData] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                
                // Call the backend endpoint to get progress data
                const response = await axios.get(
                    `https://fitness-app-2jh7.onrender.com/api/habits/${habitId}/progress`, 
                    { headers: { 'x-auth-token': token } }
                );

                setProgressData(response.data);

            } catch (error) {
                console.error('Failed to fetch progress:', error.response?.data || error.message);
                Alert.alert('Error', 'Could not load progress data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [habitId]); // The effect depends on habitId

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{habitName}</Text>
            <View style={styles.card}>
                <Text style={styles.progressLabel}>Completed in the last 7 days:</Text>
                <Text style={styles.progressValue}>
                    {progressData ? `${progressData.completionCount} times` : '0 times'}
                </Text>
            </View>
        </View>
    );
};

// Styles for the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        width: '90%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    progressLabel: {
        fontSize: 18,
        color: '#666',
    },
    progressValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#6200ee',
        marginTop: 10,
    },
});

// The crucial export line that makes this a valid component.
export default ProgressScreen;
