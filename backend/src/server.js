const express = require('express');

const mongoose = require('mongoose');

const routes = require('./routes');

const cors = require('cors');

const app = express();

const server = require('http').Server(app);

// const example = io(server);
const io = require('socket.io')(server);

//redis
const connectedUsers = {};

io.on('connection', socket => {
	const { user } = socket.handshake.query;

	connectedUsers[user] = socket.id;

	socket.on('disconnect', () => {
		delete connectedUsers[user];
	});
});

// Config of extern database
mongoose.connect(
  'mongodb+srv://matheus:matheus@cluster0-aswwu.mongodb.net/test?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(cors());

app.use((req, res, next) => {
	req.io = io;
	req.connectedUsers = connectedUsers;

	return next();
});

// config express for using JSON
app.use(express.json());


app.use(routes);

server.listen(8008, () => console.log("Server ON in 8008 "));
