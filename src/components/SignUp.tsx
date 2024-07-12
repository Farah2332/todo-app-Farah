import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, Text, useColorMode } from "@chakra-ui/react";
import lightBackgroundImage from "../assets/bg-desktop-light.jpg";
import darkBackgroundImage from "../assets/bg-desktop-dark.jpg";

interface SignUpProps {
    toggleForm: () => void; // Define the type for toggleForm prop
    onSignIn: () => void; // Define the type for onSignIn prop
}

const SignUp: React.FC<SignUpProps> = ({ toggleForm, onSignIn }) => {
    const { colorMode } = useColorMode();
    const [email, setEmail] = useState<string>(''); // Specify type for useState
    const [password, setPassword] = useState<string>(''); // Specify type for useState
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Specify type for useState
    const [error, setError] = useState<string>(''); // Specify type for useState

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post<{ token: string }>('http://localhost:5000/api/users/register', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email); 
            onSignIn(); // Trigger sign in action after successful registration
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('Failed to connect to the server');
            }
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
                <Input
                    placeholder="Email"
                    mb={3}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    mb={3}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    placeholder="Confirm Password"
                    type="password"
                    mb={3}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
