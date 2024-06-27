import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from './App.tsx';
import './index.css';

const theme = extendTheme({
    fonts: {
        body: "'Josefin Sans', sans-serif",
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
);
