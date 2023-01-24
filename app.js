const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
  Server
} = require("socket.io")
const io = new Server(server);
const port = process.env.PORT || 3334;
let users = 0;

app.use(express.static(__dirname + '/FastEasyChat/public/'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/FastEasyChat/index.html')
});

app.get('/api/audio/send', (req, res) => {
  res.sendFile(__dirname + '/FastEasyChat/public/audio/send.mp3');
})

app.get('/api/audio/receive', (req, res) => {
  res.sendFile(__dirname + '/FastEasyChat/public/audio/receive.mp3');
})

app.get('/api/abstract', (req, res) => {
  res.send('<button type="button" name="button"><a href="/FastEasyChat/api/abstract/file">Download Abstract</a></button>');
});

app.get('/api/abstract/file', (req, res) => {
  res.sendFile(__dirname + '/FastEasyChat/public/doc/Abstract.pdf');
});

app.get('/api/users', (req, res) => {
  res.send(users.toString());
});

io.on('connection', (socket) => {
  users++;
  console.log('A user connected ' + socket.id);

  socket.on('chat message', (msg) => {
    console.log('M:' + msg);
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    users--;
    console.log('user disconnect');
  })
});

server.listen(port, () => {
  console.log('Connect to Port ' + port);
})