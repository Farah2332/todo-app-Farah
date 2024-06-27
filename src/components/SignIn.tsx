import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, Text, useColorMode } from "@chakra-ui/react";
import darkBackgroundImage from "../assets/bg-desktop-dark.jpg";
import lightBackgroundImage from "../assets/bg-desktop-light.jpg";
import { useNavigate } from 'react-router-dom';

function SignIn({ toggleForm }) {
    const { colorMode } = useColorMode();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email); // Store user's email in localStorage
            navigate('/todo-list'); // Redirect to todos page upon successful login
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
                    Don't have an account yet?{" "}
                    <Button variant="link" colorScheme="teal" onClick={toggleForm}>Signup</Button>
                </Text>
            </Box>
        </Box>
    );
}

export default SignIn;
