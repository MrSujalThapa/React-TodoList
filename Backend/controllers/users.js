const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

module.exports.register = async (req, res, next) => {
    const { email, username, password } = req.body;
    try {
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);       
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            res.send(req.user)
        });
    } catch (error) {
       res.send(error)
        next(error);
    }
}

module.exports.initValue = async (req, res, next) => { 
    const { username } = req.params;
  
    try {
      // Find the user document by the username and select only the todos field
      const user = await User.findOne({ username: username }).populate('todos');
      console.log(user)
      if (user) {
        res.status(200).json(user.todos); // Send the user's todos as a response
      } else {
        res.status(404).json({ message: 'User not found' }); // Handle user not found
      }
    } catch (error) {
      console.error("Error fetching user todos:", error);
      res.status(500).json({ message: 'Server error' }); // Handle any potential server errors
    }
}

module.exports.isAuth = async (req, res, next) => { 
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
        console.log(req.user)
      } else {
        res.json({ isAuthenticated: false });
      }
}

module.exports.logout = async (req, res, next) => { 
    req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
}

module.exports.addTodo = async (req, res, next) => { 
    const { username } = req.params;
    const { texts, id, completed } = req.body;

    const newTodo = {
        text: texts,
        id: uuidv4(),
        completed: completed
    };

    try {
        // Find the user by username and update the todos array
        const user = await User.findOneAndUpdate(
            { username: username },
            { $push: { todos: newTodo } },  // Directly add the new todo as a plain object
            { new: true, runValidators: true }  // Ensure validators run and return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.todos);
    } catch (error) {
        console.error("Error adding todo:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.toggleTodo = async (req, res, next) => { 
    const { username, todoId } = req.params;
    console.log('TodoId:', todoId);

    try {
        // Find the user and populate the todos
        const user = await User.findOne({ username }).populate('todos');
        
        if (user) {
            // Find the todo by comparing UUIDs directly
            const todo = user.todos.find(t => t.id === todoId);

            if (todo) {
                todo.completed = !todo.completed;
                await user.save();
                res.status(200).json(todo);
            } else {
                res.status(404).json({ message: 'Todo not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error toggling todo:", error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports.removeTodo = async (req, res, next) => { 
    const { username, todoId } = req.params;
  
    try {
      const user = await User.findOne({ username });
  
      if (user) {
        user.todos = user.todos.filter((todo) => todo.id !== todoId);
        await user.save();
        res.status(200).json(user.todos);
      } else {
        console.log('blahs')
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error("Error removing todo:", error);
      res.status(500).json({ message: 'Server error' });
    }
}




module.exports.login = (req, res) => {
res.send("success")
}
