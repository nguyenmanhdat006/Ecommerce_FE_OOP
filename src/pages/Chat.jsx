import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect WebSocket
    socketRef.current = new WebSocket(`${import.meta.env.VITE_API_URL}/ws/chat`);

    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => socketRef.current.close();
  }, []);

  const sendMessage = () => {
    const msg = {
      from: "userA", 
      message: text
    };
    socketRef.current.send(JSON.stringify(msg));
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>WebSocket Chat</h3>

      <div style={{ border: "1px solid #ccc", height: 200, overflowY: "auto", marginBottom: 10, padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.from}:</b> {m.message}
          </div>
        ))}
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
