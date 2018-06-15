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

  // Disconnect
  socket.on('disconnect', function(data) {
    delete users[data.currentUser];
    for(var i = 0; i < usersArray.length; i++) {
      if (usersArray[i].name == data.currentUser) {
        usersArray.splice(i, 1)
      }
    }
    
    socket.emit('removed user', {usersArray: usersArray})
    console.log('Disconnected: %s sockets connected', connections.length)
  }); 

  // Send message
  socket.on('send message', function(data) {
    console.log(data);

    users[data.selectedUser].emit('new message', {selectedUser: data.selectedUser, from: data.from, input: data.input});
  })

  socket.on('typing', function(data) {
    console.log('typing!')
    users[data.selectedUser].emit('is typing', {from: data.currentUser});
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