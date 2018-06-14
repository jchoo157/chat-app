const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users = {};
usersArray = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.use(express.static('dist'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
})

io.on('connection', function(socket) {
  connections.push(socket);
  console.log('A user connected', connections.length);

  // socket.on('join', function (data) {
  //   socket.join(data.selectedUser);
  //   console.log('joined', data.selectedUser)
  // });

  // Disconnect
  socket.on('disconnect', function(data) {
    if(!socket.currentUser) return;
    delete users[socket.currentUser];
    console.log('Disconnected: %s sockets connected', connections.length)
  }); 

  // Send message

  socket.on('send message', function(data) {
    console.log(data);

    users[data.selectedUser].emit('new message', {selectedUser: data.selectedUser, from: data.from, input: data.input});
  })

  socket.on('create user', function(data, callback) {
    users[data.currentUser] = socket;
    usersArray.push({name: data.currentUser, isAgent: data.isAgent});
    io.sockets.emit('created user', {currentUser: data.currentUser, usersArray: usersArray})
  })

  // function updateUsernames() {
  //   io.sockets.emit('get users', usernames);
  // }
})