import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; // Assuming axiosInstance is properly configured
import {
    Box,
    Button,
    Input,
    Checkbox,
    Stack,
    Text,
    IconButton,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FiEye, FiUser } from "react-icons/fi";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [hideCompleted, setHideCompleted] = useState(false);
    const { colorMode } = useColorMode();
    const userEmail = localStorage.getItem('email'); // Retrieve user's email from localStorage

    useEffect(() => {
        fetchTodos(); // Fetch todos on component mount
    }, []);

    // Function to fetch todos from the server
    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            const res = await axiosInstance.get('http://localhost:5000/api/todos', {
                params: { email: userEmail }, // Pass user's email as a query parameter
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTasks(res.data); // Update tasks state with fetched data
        } catch (err) {
            console.error('Failed to fetch todos:', err);
            if (err.response) {
                console.error('Response data:', err.response.data);
            }
        }
    };

    // Function to add a new task
    const addTask = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            // Send POST request to add new task
            const res = await axiosInstance.post('http://localhost:5000/api/todos',
                { text: task, email: userEmail }, // Include user's email in the request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local tasks state with newly added task
            setTasks([...tasks, res.data]);
            setTask(''); // Clear input field after successful addition
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    };

    // Function to toggle task completion status
    const toggleTaskCompletion = async (id) => {
        try {
            // Find the task to update in the local state
            const todoToUpdate = tasks.find(task => task._id === id);
            if (!todoToUpdate) {
                console.error(`Todo with id ${id} not found.`);
                return;
            }

            // Toggle the completion status locally
            const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

            // Send PUT request to update task on the server
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            const res = await axiosInstance.put(`http://localhost:5000/api/todos/${id}`, updatedTodo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update local tasks state with updated task
            const updatedTasks = tasks.map(task =>
                task._id === id ? res.data : task
            );
            setTasks(updatedTasks);
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            const userEmail = localStorage.getItem('email'); // Retrieve user's email from localStorage

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { email: userEmail } // Pass user's email in the request body
            };

            // Send DELETE request to delete task
            await axiosInstance.delete(`http://localhost:5000/api/todos/${id}`, config);

            // Update local tasks state after successful deletion
            const updatedTasks = tasks.filter(task => task._id !== id);
            setTasks(updatedTasks);
        } catch (err) {
            console.error('Failed to delete task:', err);
            if (err.response && err.response.status === 401) {
                console.error('Unauthorized access. Please check your credentials.');
            }
        }
    };







    return (
        <Box
            height="100vh"
            width="100vw"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bg={useColorModeValue('gray.200', 'gray.900')}
            color={useColorModeValue('black', 'white')}
            p={4}
        >
            <Box
                bg={useColorModeValue('gray.100', 'gray.700')}
                p={6}
                borderRadius="md"
                boxShadow="md"
                maxWidth="600px"
                width="100%"
                position="relative"
            >
                <IconButton
                    aria-label="Toggle Hide Completed"
                    icon={hideCompleted ? <FiEye /> : <FiEye />}
                    onClick={() => setHideCompleted(!hideCompleted)}
                    position="absolute"
                    top="1rem"
                    right="4rem"
                    colorScheme="teal"
                    variant="outline"
                />
                <Box
                    as="button"
                    aria-label="Profile"
                    onClick={() => { } /* You can add functionality here if needed */}
                    position="absolute"
                    top="1rem"
                    right="1rem"
                    bg="teal.500"
                    borderRadius="full"
                    width="36px"
                    height="36px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                >
                    <FiUser color="white" />
                </Box>
                <Text fontSize="2xl" mb={4}>To Do App</Text>
                <Stack spacing={3}>
                    {tasks.filter(task => !hideCompleted || !task.completed).map((task, index) => (
                        <Box key={task._id} display="flex" alignItems="center">
                            <Checkbox
                                isChecked={task.completed}
                                onChange={() => toggleTaskCompletion(task._id)}
                                mr={3}
                            />
                            <Text as={task.completed ? 's' : undefined}>{task.text}</Text>
                            <IconButton
                                aria-label="Delete task"
                                icon={<DeleteIcon />}
                                size="sm"
                                onClick={() => deleteTask(task._id)}
                                ml="auto"
                            />
                        </Box>
                    ))}
                </Stack>
                <Box mt={4}>
                    <Input
                        placeholder="New Note"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        mb={3}
                        bg={useColorModeValue('white', 'gray.600')}
                    />
                    <Button colorScheme="teal" width="100%" onClick={addTask}>Add Note</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ToDoList;
