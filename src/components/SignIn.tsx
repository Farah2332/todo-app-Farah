import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, Text, useColorMode } from "@chakra-ui/react";
import darkBackgroundImage from "../assets/bg-desktop-dark.jpg";
import lightBackgroundImage from "../assets/bg-desktop-light.jpg";
import { useNavigate } from 'react-router-dom';

interface SignInProps {
    toggleForm: () => void; // Define the type for toggleForm prop
    onSignIn: () => void; // Define the type for onSignIn prop
}

const SignIn: React.FC<SignInProps> = ({ toggleForm, onSignIn }) => {
    const { colorMode } = useColorMode();
    const [email, setEmail] = useState<string>(''); // Specify type for useState
    const [password, setPassword] = useState<string>(''); // Specify type for useState
    const [error, setError] = useState<string>(''); // Specify type for useState
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.post<{ token: string }>('http://localhost:5000/api/users/login', { email, password });

            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            onSignIn(); // Trigger the onSignIn function passed from App.tsx
            navigate('/todo-list');
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
                <Text fontSize="2xl" mb={4}>Login</Text>
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
                <Button colorScheme="teal" width="100%" mb={3} onClick={handleSignIn}>Login</Button>
                {error && (
                    <Text color="red.500" textAlign="center" mb={3}>{error}</Text>
                )}
                <Text textAlign="center">
                    Don't have an account yet?{' '}
                    <Button variant="link" colorScheme="teal" onClick={toggleForm}>
                        Signup
                    </Button>
                </Text>
            </Box>
        </Box>
    );
}

export default SignIn;
