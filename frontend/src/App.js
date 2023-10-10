import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] }); // Replace with your server URL

function App() {
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);

  const getAllStudents = async () => {
    let data = await fetch('http://localhost:3001/get-students')
    let result = await data.json();
    setStudents(result)

  }

  useEffect(() => {
    socket.on('notification', (message) => {
      setNotifications([...notifications, message]);
    });
    getAllStudents();
  }, [notifications]);

  return (
    <div>
      <h1>Real-time Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
      <h1>ALL Students</h1>
      <ul>
        {students.map((element, index) => {
          return (
          <li key={index}>{element._id} - {element.studentName} - {element.courseName}</li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
