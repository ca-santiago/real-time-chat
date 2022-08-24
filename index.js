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
  const userName = socket.id.slice(0, 3);
  const id = socket.id;
  socket.emit("join", {userName, userId: id });
  socket.on("disconnect", () => handleDisconnection(socket));

  // Register new connection server side count
  connected.push({id, userName});
  io.emit("member-list-update", {count: connected.length});

  socket.on("new-message", ({message}) => {
    io.emit("message", {message, date: new Date(), userName, userId: id })
  });
}

function handleDisconnection(socket) {
  connected = connected.filter(({id}) => id !== socket.id);
  io.emit("member-list-update", {count: connected.length});
}


server.listen(3000);
