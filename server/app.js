const io = require("socket.io")(5500);
const express = require("express");
const app = express();
const http = require("http");

// the count state
let history = [
  { name: "env-restart", status: "running" },
  { name: "env-duplicate", status: "failed" },
  { name: "env-delete", status: "success" },
];

io.on("connect", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("join_room: ", data);
    socket.join(data);
  });

  app.get("/history/:accountId", (req, res) => {
    const accountId = req.params.accountId;
    socket.join(accountId);
    history.forEach((m) => {
      const msg = { name: m.name, status: m.status };
      io.to(accountId).emit("message", msg);
    });
    res.status(200).send({ accountId, topic: "history" });
  });

  app.get("/message/:accountId/:jobName/:jobStatus", (req, res) => {
    const accountId = req.params.accountId;
    const jobName = req.params.jobName;
    const jobStatus = req.params.jobStatus;
    const msg = { name: jobName, status: jobStatus };

    socket.join(accountId);
    io.to(accountId).emit("message", msg);
    res.status(200).send({ accountId, jobName, jobStatus, topic: "add" });
  });
});

const server = http.createServer(app);
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
