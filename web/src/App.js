import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "NAME" });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = state;
    socketRef.current.emit("message", { name, message });
    e.preventDefault();
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <div className="chat-element">
          <div className="chat-element-name">{name}</div>
          <div className="chat-element-message">{message}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="card">
      <div className="render-chat">
        <h1>Chat Log</h1>
        <div className="chat-window">{renderChat()}</div>
      </div>
      <form onSubmit={onMessageSubmit}>
        <div className="name-field">
          <input
            className="name-field"
            name="name"
            onChange={(e) => onTextChange(e)}
            value={state.name}
            onKeyUp={() => {
              state.name = state.name.toUpperCase();
            }}
            label="Name"
            placeholder="Name"
          />
        </div>
        <div>
          <input
            className="message-field"
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
            placeholder="Message"
          />
        </div>
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
