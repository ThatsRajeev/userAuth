const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
dotenv.config();

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true,
}));

// MongoDB Connection
async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
}

  connectToDatabase();

// Mount authRouter
const authRouter = require('./api/routes/auth');
app.use('/api/auth', authRouter);

// Mount postRouter
const postRouter = require('./api/routes/posts');
app.use('/api/posts', postRouter);

// Server Start
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});