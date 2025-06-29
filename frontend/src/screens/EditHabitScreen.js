// frontend/src/screens/EditHabitScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is a standard functional React component.
const EditHabitScreen = ({ route, navigation }) => {
    // Get the habit data passed from the dashboard
    const { habit } = route.params;

    // Initialize state with the existing habit data
    const [name, setName] = useState(habit.name);
    const [description, setDescription] = useState(habit.description || ''); // Use empty string if description is null/undefined

    const handleSaveChanges = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Habit name cannot be empty.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            
            // Call the PUT endpoint to update the habit
            await axios.put(
                `https://fitness-app-2jh7.onrender.com/api/habits/${habit._id}`, 
                { name, description }, 
                { headers: { 'x-auth-token': token } }
            );

            // Go back to the dashboard upon success
            navigation.goBack();

        } catch (error) {
            console.error('Failed to edit habit:', error.response?.data || error.message);
            Alert.alert('Error', 'Could not save the changes.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Habit Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Styles for the screen
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    form: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#f5f5f5', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 20 },
    textArea: { height: 100, textAlignVertical: 'top' },
    button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

// The crucial export line that makes this a valid component.
export default EditHabitScreen;
