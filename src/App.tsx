import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, Button, useColorMode } from "@chakra-ui/react";
import lightBackgroundImage from "./assets/bg-desktop-light.jpg";
import darkBackgroundImage from "./assets/bg-desktop-dark.jpg";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ToDoList from './components/ToDoList';

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    const [isSignedIn, setIsSignedIn] = useState(false); // State to check if user is signed in
    const [isSignIn, setIsSignIn] = useState(true); // Initially set to true to display the sign-in page

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    const handleSignIn = () => {
        setIsSignedIn(true);
    };

    return (
        <Router>
            <>
                <Box position="absolute" top="1rem" right="1rem">
                    <Button onClick={toggleColorMode}>
                        Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
                    </Button>
                </Box>
                <Routes>
                    <Route path="/" element={!isSignedIn ? (
                        isSignIn ? <SignIn onSignIn={handleSignIn} toggleForm={toggleForm} /> : <SignUp onSignIn={handleSignIn} toggleForm={toggleForm} />
                    ) : (
                            <Navigate to="/todo-list" replace />
                        )} />
                    <Route path="/todo-list" element={<ToDoList />} />
                    {/* Add more routes as needed */}
                </Routes>
            </>
        </Router>
    );
}

export default App;
