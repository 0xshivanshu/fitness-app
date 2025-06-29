// frontend/src/screens/CreateHabitScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateHabitScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSaveHabit = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a name for your habit.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            
            await axios.post('https://fitness-app-2jh7.onrender.com/api/habits', 
                { name, description },
                { headers: { 'x-auth-token': token } }
            );
            navigation.goBack();

        } catch (error) {
            console.error('Failed to create habit:', error.response?.data || error.message);
            Alert.alert('Error', 'Could not save the habit.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Habit Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Drink water"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="e.g., 8 glasses a day"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <TouchableOpacity style={styles.button} onPress={handleSaveHabit}>
                    <Text style={styles.buttonText}>Save Habit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    form: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#f5f5f5', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 20 },
    textArea: { height: 100, textAlignVertical: 'top' },
    button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default CreateHabitScreen;