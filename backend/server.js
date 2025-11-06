const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests only from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed request headers
  credentials: true, // Allow sending cookies and HTTP authentication
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}
));

// Body Parser Middleware
// This allows us to accept JSON data in the body
app.use(express.json());

// --- THIS IS THE NEW PART ---
// Make the 'uploads' folder public
// This allows files to be accessed via http://localhost:5001/uploads/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// --- END OF NEW PART ---

// A simple test route
app.get('/', (req, res) => {
    res.send('HMS API is running...');
});

// --- Mount Routers ---
// This tells the server to use the 'auth.js' file
// for any URL that starts with '/api/auth'
app.use('/api/auth', require('./routes/auth'));

// We will uncomment these as we build them
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/documents', require('./routes/documents'));


const PORT = process.env.PORT || 5001;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);