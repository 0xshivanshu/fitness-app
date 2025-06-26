// frontend/src/screens/LoginScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Login Failed', 'Please enter both email and password.');
        }
        try {
            const response = await axios.post('http://192.168.239.223:5001/api/auth/login', {
                email,
                password,
            });
            
            const token = response.data.token;
            if (token) {
                await AsyncStorage.setItem('userToken', token);
                await Updates.reloadAsync();
            } else {
                Alert.alert('Login Failed', 'Could not retrieve token.');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>

            {/* A basic, reliable TextInput from React Native */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            {/* Another basic, reliable TextInput */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            {/* Our proven, working button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkButtonText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    linkButton: { marginTop: 20, alignItems: 'center' },
    linkButtonText: { color: '#6200ee', fontSize: 16 },
});

export default LoginScreen;