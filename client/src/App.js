import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// storing socket connection in this global variable
let socket = null;

const App = () => {
  const [message, setMessage] = useState({});
  const [room, setRoom] = useState(0);
  const [joined, setJoined] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setJoined("Joined");
    }
  };

  // after component mount
  useEffect(() => {
    // connect to the socket server
    socket = io("ws://localhost:5500");

    // update message on message event
    socket.on("message", function (message) {
      console.log(message);
      setMessage(message);
    });
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setJoined("");
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>
      <h1>
        Room: {room} {joined}
      </h1>
      <p>
        {message?.name} {message?.status}
      </p>
    </div>
  );
};

export default App;
