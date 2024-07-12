import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { todoListState, filteredTodoListState } from '../recoil/atoms';
import { fetchTodosSelector, addTodoSelector, toggleTodoSelector, deleteTodoSelector, todosLoadingSelector } from '../recoil/selectors';
import { Box, Button, Checkbox, IconButton, Input, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify'; // Import toast from react-toastify

function ToDoList() {
    const [todos, setTodos] = useRecoilState(todoListState);
    const filteredTodos = useRecoilValue(filteredTodoListState);
    const [isLoading, setIsLoading] = useRecoilState(todosLoadingSelector);
    const [task, setTask] = useState('');
    const [hideCompleted, setHideCompleted] = useState(false);

    // Function to add toast notification
    const showToast = (message: string) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    // Fetch todos callback
    const fetchTodos = useRecoilCallback(({ snapshot, set }) => async () => {
        setIsLoading(true);
        try {
            const userEmail = localStorage.getItem('email');
            if (!userEmail) throw new Error('User email not found');
            const fetchedTodos = await snapshot.getPromise(fetchTodosSelector);
            console.log('Fetched Todos:', fetchedTodos); // Log fetched todos
            set(todoListState, fetchedTodos); // Update todoListState
        } catch (error) {
            console.error('Error fetching todos:', error);
            showToast('Failed to fetch todos'); // Example of using toast for error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Add todo callback
    const addTodo = useRecoilCallback(({ snapshot }) => async (newTodo: { text: string; email: string }) => {
        try {
            const addedTodo = await snapshot.getPromise(addTodoSelector(newTodo));
            showToast('Task added successfully'); // Example of using toast for success
            return addedTodo;
        } catch (error) {
            console.error('Error adding todo:', error);
            showToast('Failed to add task'); // Example of using toast for error
            throw error;
        }
    }, []);

    // Toggle todo callback
    const toggleTodo = useRecoilCallback(({ snapshot }) => async (id: string) => {
        try {
            const updatedTodo = await snapshot.getPromise(toggleTodoSelector(id));
            showToast('Task updated'); // Example of using toast for success
            return updatedTodo;
        } catch (error) {
            console.error('Error toggling todo status:', error);
            showToast('Failed to update task'); // Example of using toast for error
            throw error;
        }
    }, []);

    // Delete todo callback
    const deleteTodo = useRecoilCallback(({ snapshot }) => async (id: string) => {
        try {
            console.log('Deleting todo with id:', id); // Log deleting todo
            await snapshot.getPromise(deleteTodoSelector(id));
            setTodos((prevTodos) => prevTodos.filter(todo => todo._id !== id));
            showToast('Task deleted'); // Example of using toast for success
        } catch (error) {
            console.error('Error deleting todo:', error);
            showToast('Failed to delete task'); // Example of using toast for error
            throw error;
        }
    });

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleAddTask = async () => {
        try {
            const userEmail = localStorage.getItem('email');
            if (!userEmail) throw new Error('User email not found');
            const newTodo = await addTodo({ text: task, email: userEmail });
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setTask('');
        } catch (error) {
            console.error('Error adding todo:', error);
            showToast('Failed to add task'); // Example of using toast for error
        }
    };

    const handleToggleTaskCompletion = async (id: string) => {
        try {
            const updatedTodo = await toggleTodo(id);
            setTodos((prevTodos) =>
                prevTodos.map(todo => todo._id === id ? updatedTodo : todo)
            );
        } catch (error) {
            console.error('Error toggling todo status:', error);
            showToast('Failed to update task'); // Example of using toast for error
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTodo(id);
        } catch (error) {
            console.error('Error deleting todo:', error);
            showToast('Failed to delete task'); // Example of using toast for error
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
                <Stack spacing={4}>
                    {todos.length > 0 ? (
                        todos.map((todo) => (
                            <Box key={todo._id} display="flex" alignItems="center">
                                <Checkbox
                                    isChecked={todo.completed}
                                    onChange={() => handleToggleTaskCompletion(todo._id)}
                                    mr={3}
                                />
                                <Text as={todo.completed ? 's' : undefined} flex="1">
                                    {todo.text}
                                </Text>
                                <IconButton
                                    aria-label="Delete task"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    onClick={() => handleDeleteTask(todo._id)}
                                    ml="auto"
                                />
                            </Box>
                        ))
                    ) : (
                            <Text>No todos available</Text>
                        )}
                </Stack>

                <Box mt={4}>
                    <Input
                        placeholder="New Note"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        mb={3}
                        bg={useColorModeValue('white', 'gray.600')}
                    />
                    <Button colorScheme="teal" width="100%" onClick={handleAddTask}>
                        Add Note
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ToDoList;
