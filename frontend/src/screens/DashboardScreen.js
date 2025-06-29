// frontend/src/screens/DashboardScreen.js

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    const [habits, setHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHabits = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) { logout(); return; }
            const response = await axios.get('https://fitness-app-2jh7.onrender.com/api/habits', {
                headers: { 'x-auth-token': token }
            });
            setHabits(response.data);
        } catch (error) {
            console.error("Failed to fetch habits:", error.response?.data || error.message);
            Alert.alert('Error', 'Could not fetch habits.');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchHabits(); }, []));

    const handleToggleHabit = async (habitId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.put(
                `http://192.168.239.223:5001/api/habits/${habitId}/mark`, 
                {},
                { headers: { 'x-auth-token': token } }
            );
            setHabits(currentHabits => 
                currentHabits.map(h => h._id === habitId ? response.data : h)
            );
        } catch (error) {
            console.error("Failed to toggle habit:", error);
            Alert.alert('Error', 'Could not update the habit.');
        }
    };

    const isHabitCompletedToday = (completedDates) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return completedDates.some(dateStr => {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(
                `http://192.168.239.223:5001/api/habits/${habitId}`, 
                { headers: { 'x-auth-token': token } }
            );
            setHabits(currentHabits => 
                currentHabits.filter(h => h._id !== habitId)
            );
        } catch (error) {
            console.error("Failed to delete habit:", error);
            Alert.alert('Error', 'Could not delete the habit.');
        }
    };

    const confirmDelete = (habitId, habitName) => {
        Alert.alert(
            "Delete Habit",
            `Are you sure you want to delete "${habitName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => handleDeleteHabit(habitId), style: "destructive" }
            ]
        );
    };

    const renderHabitItem = ({ item }) => {
        const isCompleted = isHabitCompletedToday(item.completedDates);
        return (
            <View style={styles.habitItem}>
                <TouchableOpacity onPress={() => handleToggleHabit(item._id)} style={styles.checkButtonContainer}>
                    <View style={[styles.checkButton, isCompleted && styles.checkButtonCompleted]}>
                        <Text style={styles.checkText}>✓</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.habitTextContainer}
                    onPress={() => navigation.navigate('EditHabit', { habit: item })}
                >
                    <Text style={[styles.habitName, isCompleted && styles.completedText]}>{item.name}</Text>
                    {item.description ? <Text style={[styles.habitDescription, isCompleted && styles.completedText]}>{item.description}</Text> : null}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Progress', { habitId: item._id, habitName: item.name })} 
                    style={styles.progressButton}
                >
                    <Text style={styles.progressButtonText}>📊</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => confirmDelete(item._id, item.name)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                {habits.length === 0 ? (
                    <Text style={styles.infoText}>You haven't added any habits yet.</Text>
                ) : (
                    <FlatList
                        data={habits}
                        keyExtractor={(item) => item._id}
                        renderItem={renderHabitItem}
                        style={{ width: '100%' }}
                        extraData={habits}
                    />
                )}
            </View>
            <TouchableOpacity 
                style={styles.createButton} 
                onPress={() => navigation.navigate('CreateHabit')}
            >
                <Text style={styles.createButtonText}>+</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    infoText: { fontSize: 18, color: 'gray', marginTop: 40, textAlign: 'center' },
    habitItem: { backgroundColor: 'white', marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 2, flexDirection: 'row', alignItems: 'center' },
    checkButtonContainer: { padding: 20 },
    habitTextContainer: { flex: 1, paddingVertical: 20 },
    habitName: { fontSize: 18, fontWeight: '500' },
    habitDescription: { fontSize: 14, color: 'gray', marginTop: 4 },
    completedText: { textDecorationLine: 'line-through', color: '#aaa' },
    checkButton: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#6200ee', justifyContent: 'center', alignItems: 'center' },
    checkButtonCompleted: { backgroundColor: '#6200ee', borderColor: '#6200ee' },
    checkText: { color: 'white', fontWeight: 'bold' },
    progressButton: { padding: 20 },
    progressButtonText: { fontSize: 24 },
    deleteButton: { paddingLeft: 0, paddingRight: 20, paddingVertical: 20 },
    deleteButtonText: { fontSize: 24, color: '#d9534f', fontWeight: 'bold' },
    createButton: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#6200ee', justifyContent: 'center', alignItems: 'center', elevation: 8 },
    createButtonText: { color: 'white', fontSize: 30 },
});

export default DashboardScreen;
