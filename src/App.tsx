import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Box, Button, useColorMode, ChakraProvider } from "@chakra-ui/react";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ToDoList from './components/ToDoList';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    const handleSignIn = () => {
        setIsSignedIn(true);
    };

    const handleSignOut = () => {
        setIsSignedIn(false);
    };

    return (
        <RecoilRoot>
            <ChakraProvider>
                <Router>
                    <>
                        <Box position="absolute" top="1rem" right="1rem">
                            <Button onClick={toggleColorMode}>
                                Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
                            </Button>
                        </Box>
                        <ToastContainer /> 
                        <Routes>
                            <Route path="/" element={!isSignedIn ? (
                                isSignIn ? <SignIn onSignIn={handleSignIn} toggleForm={toggleForm} /> : <SignUp onSignIn={handleSignIn} toggleForm={toggleForm} />
                            ) : (
                                    <Navigate to="/todo-list" replace />
                                )} />
                            <Route path="/todo-list" element={isSignedIn ? <ToDoList onSignOut={handleSignOut} /> : <Navigate to="/" replace />} />
                        </Routes>
                    </>
                </Router>
            </ChakraProvider>
        </RecoilRoot>
    );
}

export default App;
