const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
  Server
} = require("socket.io")
const io = new Server(server);
const port = process.env.PORT || 3334;
var userData = require('./user.json');
let users = 0;

app.use(express.static(__dirname + '/FastEasyChat/public/'));
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/FastEasyChat/login.html')
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

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + "/FastEasyChat/index.html");
});

app.post('/api/login', (req, res) => {
  if (auth( req.body.username,req.body.password)) {
    res.redirect("/chat");    
  } else {
    res.redirect("/");
  }
});

function auth( name, pass) {
  for(i=0; i < userData.length; i++)
  {
    if(userData[i].username == name &&
      userData[i].password == pass){
        return true;
    }
  }
  return false;
}

function getUserName(socket_id) {
  for(i=0; i < userData.length; i++)
  {
    if(userData[i].socketId == socket_id ){
        return userData[i].username;
    }
  }
}function setSocketId(name, uSocketId) {
  for(i=0; i < userData.length; i++)
  {
    if(userData[i].username == name ){
        return userData[i].socketId = uSocketId;
    }
  }
}

io.use((socket, next)=>{
  if(auth(socket.handshake.headers["username"],socket.handshake.headers["password"])){
    setSocketId(socket.handshake.headers["username"],socket.id);
    next();
  } 
  else{
    next(new Error());
  }
})

io.on('connection', (socket) => {
  users++;
  console.log(getUserName(socket.id) +' connected');
 
  socket.on('chat message', (msg) => {
    console.log('M:' + msg);
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    users--;
    console.log(getUserName(socket.id) + ' disconnect');
  })
});

server.listen(port, () => {
  console.log('Connect to Port ' + port);
})