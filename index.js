const express = require("express");
const app = express();

// Setup server
const server = require("http").createServer(app);

// Setup socket server
const io = require("socket.io")(server);

// Setup public folder
app.use(express.static(__dirname + "/public"));

io.on("connection", registerNewSocketConnection);

// Internal state xD
let connected = [];

function registerNewSocketConnection(socket) {
  socket.emit("join", {message: "Welcome to the server"});
  socket.on("disconnect", () => handleDisconnection(socket));

  // Register new connection server side count
  connected.push(socket.id);
  socket.emit("member-list-update", {count: connected.length});

  socket.on("new-message", ({message}) => {
    io.emit("message", {message, date: new Date()})
  });
}

function handleDisconnection(socket) {
  connected = connected.filter(id => id !== socket.id);
  socket.emit("member-list-update", {count: connected.length});
}


server.listen(3000);
