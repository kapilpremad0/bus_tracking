const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

const verifyToken = require('./middlewares/auth'); // 👈 Import middleware

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // for form data

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/assets', express.static(path.join(__dirname, 'assets')));



app.use('/admin',require('./routes/admin/index.js'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api.js'));
app.use('/api/profile', verifyToken,require('./routes/profile'));
app.use('/api/attendance', verifyToken,require('./routes/attendance'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
