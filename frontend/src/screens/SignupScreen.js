// frontend/src/screens/SignupScreen.js

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSignup = async () => {
        console.log('--- Sign Up Button Pressed ---');
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        try {
            console.log('Attempting to call API...');
            
            const response = await axios.post('https://fitness-app-2jh7.onrender.com/api/auth/signup', {
                email: email,
                password: password,
            });

            console.log('--- API Call Successful ---');
            Alert.alert('Success!', 'Account created successfully.');
            navigation.navigate('Login');

        } catch (error) {
            console.log('--- ERROR CAUGHT ---');
            if (error.response) {
                console.log('Error Data:', error.response.data);
                Alert.alert('Signup Failed', error.response.data.message);
            } else if (error.request) {
                console.log('Network Error Request:', error.request);
                Alert.alert('Network Error', 'Could not connect to the server.');
            } else {
                console.log('General Error Message:', error.message);
                Alert.alert('Error', 'An unexpected error occurred.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
            <TextInput label="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    input: { marginBottom: 16 },
    button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    linkButton: { marginTop: 15, alignItems: 'center' },
    linkButtonText: { color: '#6200ee', fontSize: 14 },
});

export default SignupScreen;