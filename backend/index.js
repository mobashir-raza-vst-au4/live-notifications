const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB replica set
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.djp5y35.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const enrollmentSchema = new mongoose.Schema({
  studentName: String,
  courseName: String,
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

app.use(express.json());

io.on('connection', (socket) => {
  console.log('A user connected');
});

// Create an endpoint for enrollment
app.post('/enroll', async (req, res) => {
    try {
      const { name, course } = req.body;
  
      // Save enrollment data to MongoDB
      const enrollment = new Enrollment({
        studentName: name,
        courseName: course,
      });
      await enrollment.save();
  
      return res.status(201).json({ message: 'Enrollment successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Set up a change stream on the enrollment collection
const enrollmentChangeStream = Enrollment.watch();

enrollmentChangeStream.on('change', (change) => {
  if (change.operationType === 'insert') {
    const { studentName, courseName } = change.fullDocument;
    
    // Emit a notification event
    io.emit('notification', `Student ${studentName} enrolled in ${courseName}`);
  }
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
