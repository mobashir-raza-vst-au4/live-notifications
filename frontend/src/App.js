import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] }); // Replace with your server URL

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('notification', (message) => {
      setNotifications([...notifications, message]);
    });
  }, [notifications]);

  return (
    <div>
      <h1>Real-time Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
