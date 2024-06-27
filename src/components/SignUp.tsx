import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, Text, useColorMode } from "@chakra-ui/react";
import lightBackgroundImage from "../assets/bg-desktop-light.jpg";
import darkBackgroundImage from "../assets/bg-desktop-dark.jpg";

function SignUp({ toggleForm, onSignIn }) {
    const { colorMode } = useColorMode();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/users/register', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email); 
            // Optionally redirect or update UI after successful registration
            // Example: navigate('/todos');
            onSignIn(); // Trigger sign in action after successful registration
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <Box
            backgroundImage={`url(${colorMode === "dark" ? darkBackgroundImage : lightBackgroundImage})`}
            height="100vh"
            width="100vw"
            backgroundSize="cover"
            backgroundPosition="center"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Box
                bg={colorMode === "dark" ? "gray.700" : "white"}
                p={6}
                borderRadius="md"
                boxShadow="md"
                maxWidth="400px"
                width="100%"
            >
                <Text fontSize="2xl" mb={4}>Register</Text>
                <Input placeholder="Email" mb={3} value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" type="password" mb={3} value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder="Confirm Password" type="password" mb={3} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button colorScheme="teal" width="100%" mb={3} onClick={handleSignUp}>Register</Button>
                {error && (
                    <Text color="red.500" textAlign="center" mb={3}>{error}</Text>
                )}
                <Text textAlign="center">
                    Already have an account?{' '}
                    <Button variant="link" colorScheme="teal" onClick={toggleForm}>Login</Button>
                </Text>
            </Box>
        </Box>
    );
}

export default SignUp;
