import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import TodoItem from "../Components/TodoItem";
import TodoForm from "../Components/TodoForm";
import axios from 'axios';
import Navbar from "../Components/Navbar.jsx"

import { Box, Typography } from "@mui/material";

import { useState, useEffect } from "react";

const fetchTodos = async (username) => {
    try {
      const response = await axios.get(`http://localhost:4000/initValues/${username}`);
      console.log("Fetched todos:", response.data);
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      return [];
    }
  };

export default function CreateList() {
  const [todos, setTodos] = useState([]);
  const location = useLocation();
  const { username } = location.state || {}; // Get the username from the state

  useEffect(() => {
    const getTodos = async () => {
      const initialTodos = await fetchTodos(username);
      setTodos(initialTodos);
    };
    getTodos();
  }, [username]);

  const removeTodo = async (text) => {
    try {
    const todo = todos.filter((t) => t.text === text)
      await axios.delete(`http://localhost:4000/removeTodo/${username}/${todo[0].id}`);
      setTodos(todos.filter((t) => t.text !== text));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };
  

  const toggleTodo = async (text) => {
    // console.log('Todo ID to toggle:', id); 
    const todo = todos.filter((t) => t.text === text); // Ensure the ID matches the format in MongoDB
    console.log(todo[0].id)

    try {
        const response = await axios.put(`http://localhost:4000/toggleTodo/${username}/${todo[0].id}`, { completed: !todo[0].completed });
        setTodos(todos.map((t) => (t.text === text ? response.data : t)));
    } catch (error) {
        console.error("Failed to update todo:", error);
    }
};
  

  const addTodo = async (text) => {
    try {
      const response = await axios.post(`http://localhost:4000/addTodo/${username}`, { texts: text, completed: false});
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };
  
  return ( <>
    <Navbar />
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center", 
        flexDirection: "column", 
        alignItems: "center",
        m: 5,
      }}
    >
        <div style={{display:"flex"}}>
      <Typography variant="h2" component="h1" sx={{ flexGrow: 1, width:"100%", justifyContent:"center"}}>
        Todos
      </Typography>
      </div>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {todos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            remove={removeTodo}
            toggle={() => toggleTodo(todo.text)}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </List>
    </Box>
    </>
  );
}