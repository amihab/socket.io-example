import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./styles.css";

// storing socket connection in this global variable
let socket = null;

const App = () => {
  const [message, setMessage] = useState({});
  const [accountId, setAccountId] = useState("1");

  const getStatusColor = (status) => {
    switch (status) {
      case "married":
        return "cyan";
      case "single":
        return "lightgreen";
      case "seperated":
        return "pink";
      default:
        return "white";
    }
  };

  const onAccountChange = (event) => {
    setAccountId(event.target.value);
    document.getElementById("joinMsg").style.display = "none";
    setMessage({});
  };

  const joinRoom = () => {
    socket.emit("join", {
      room: accountId,
    });
    document.getElementById("joinMsg").style.display = "";
  };

  // after component mount
  useEffect(() => {
    // connect to the socket server
    socket = io("http://localhost:5500", {
      withCredentials: true, // Include credentials (if needed)
      transports: ["websocket"], // Use WebSocket explicitly
    });

    // update message on message event
    socket.on("message", function (message) {
      console.log(message);
      setMessage(message);
    });
  }, []);

  return (
    <div className="App" style={{ paddingLeft: "10px", paddingTop: "10px" }}>
      <label
        style={{
          fontSize: "14px",
          backgroundColor: "lightgreen",
          padding: "5px",
          marginLeft: "4px",
        }}
      >
        Account Id:
      </label>
      <input
        id="accountId"
        type="number"
        style={{ width: "60px", marginLeft: "5px", padding: "4px" }}
        value={accountId}
        onChange={onAccountChange}
      />
      <button style={{ marginLeft: "5px", padding: "4px" }} onClick={joinRoom}>
        Join Room
      </button>
      <label
        id="joinMsg"
        style={{
          marginLeft: "5px",
          padding: "4px",
          display: "none",
          color: "blue",
          fontSize: "14px",
          fontFamily: "Arial",
        }}
      >
        Joined successfully
      </label>
      <br />
      <table className="tbl">
        <tbody>
          <tr>
            <td className="tblHead" colSpan={2}>
              Last Message From Socket
            </td>
          </tr>
          <tr>
            <td className="tdHead" style={{ width: "40%" }}>
              Item
            </td>
            <td className="tdHead" style={{ width: "60%" }}>
              Value
            </td>
          </tr>
          <tr>
            <td className="td">Name</td>
            <td className="td">{message?.name}</td>
          </tr>
          <tr>
            <td className="td">Age</td>
            <td className="td">{message?.age}</td>
          </tr>
          <tr>
            <td className="td">Address</td>
            <td className="td">{message?.address}</td>
          </tr>
          <tr>
            <td className="td">City</td>
            <td className="td">{message?.city}</td>
          </tr>
          <tr>
            <td className="td">ZipCode</td>
            <td className="td">{message?.zipCode}</td>
          </tr>
          <tr>
            <td className="td">Status</td>
            <td
              className="td"
              style={{
                backgroundColor: getStatusColor(message?.status),
              }}
            >
              {message?.status}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
