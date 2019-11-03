const express = require('express');

const route = express.Router();

const UserController = require('./controllers/UserController');
const ConversationController = require('./controllers/ConversationController');

//Routes of Users -------------------------------------------------------------------------------

route.get('/', (req, res) => res.send("ata"));

//  route show all users
route.get('/users', UserController.index);

//  route create user
route.post('/users', UserController.store);

//  route show one user
route.get('/users/:id', UserController.show);

//  route update user
route.put('/users/:id', UserController.update);

//  route delete user
route.delete('/users/:id', UserController.delete);

//Routes of Conversation ------------------------------------------------------------------------

//  route of index
route.get('/conversations', ConversationController.index);

//  route of the all conversations
route.post('/users/:receiver/conversations', ConversationController.store);

//  route of the one conversation
route.get('/users/:receiver/conversation', ConversationController.show);

module.exports = route;
