const io = require("socket.io")(5500);
const express = require("express");
const app = express();
const http = require("http");

io.on("connect", (socket) => {
  console.log(`Client: ${socket.id}, connected`);

  /**
   * Event listener for 'join' event.
   * Join room will be triggered mostly from UI client, but can be triggered from server as well.
   * @param {Object} data - The data sent with the 'join' event.
   */
  socket.on("join", (data) => {
    const { room } = data;
    socket.join(room);
    console.log(`Client: ${socket.id} joined room: ${room}`);
  });

  /**
   * Event listener for 'leave' event.
   * @param {Object|string} room - The room that the client is leaving.
   */
  socket.on("leave", (room) => {
    console.log(`Client ${socket.id}, left room: ${room}`);
  });

  /**
   * Event listener for 'disconnect' event.
   * @param {Object} reason - The reason for the disconnect.
   */
  socket.on("disconnect", (reason) => {
    console.log(`Client: ${socket.id} is disconnected, reason: ${reason}`);
  });

  /**
   * Event listener for 'disconnecting' event.
   * @param {Object} reason - The reason for the disconnect.
   */
  socket.on("disconnecting", (reason) => {
    const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
    console.log(`Client: ${socket.id}, disconnecting from rooms: ${rooms}`);
    console.log(`Reason: ${reason}`);
  });

  /**
   * Event listener for 'connect_error' event.
   * @param {Object} reason - The reason for the connection error.
   */
  socket.on("connect_error", (reason) => {
    console.log(`Connection error, ${reason}`);
  });

  /**
   * Event listener for 'connect_failed' event.
   * @param {Object} reason - The reason for the connection failure.
   */
  socket.on("connect_failed", (data) => {
    console.log(`Connection failed, ${data}`);
  });
});

// App setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App routes
app.get("/health", (req, res) => {
  res.send({ status: "healthy" });
});

app.post("/message/:room", (req, res) => {
  const room = req.params.room;
  const message = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    city: req.body.city,
    zipCode: req.body.zipCode,
    status: req.body.status,
  };

  // socket.join(room);
  io.to(room).emit("message", message);
  res.status(200).send({ status: "sent", message });
});

const server = http.createServer(app);
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
