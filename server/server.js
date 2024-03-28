const http = require('http');
const dotenv = require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app'); 
const { Server } = require("socket.io"); 

// Connect to MongoDB using the provided URI
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Create an HTTP server from the Express app
    const httpServer = http.createServer(app);

    // Setup WebSocket server with socket.io
    const io = new Server(httpServer, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
    });

    // Attach io to the app for use in other parts of the application
    app.set('io', io);

    // WebSocket connection event
    io.on('connection', (socket) => {
      console.log('A user connected with id:', socket.id);
      
      socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
      });
      
    });

    // Port for the server
    const PORT = process.env.PORT || 4000;

    // Start the HTTP server instead of the Express app directly
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // MongoDB connection events
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('MongoDB connection established successfully');
    });

  }).catch(err => console.error('MongoDB connection error:', err));
