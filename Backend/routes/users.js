const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    // .get(users.renderRegister) 
    .post(users.register) 

router.route('/login')
    .post(passport.authenticate('local'), users.login)

router.route('/logout')
.get(users.logout)

router.route('/toggleTodo/:username/:todoId')
.put(users.toggleTodo)


router.route('/removeTodo/:username/:todoId')
.delete(users.removeTodo)

router.route('/initValues/:username')
.get(users.initValue)

router.route('/check-auth')
.get(users.isAuth)

router.route('/addTodo/:username')
.post(users.addTodo)

module.exports = router;