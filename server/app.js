const express = require('express');
const cors = require('cors');
const app = express();
const adminRoutes = require('./Routes/adminRoutes');
const facultyRoutes = require('./Routes/facultyRoutes');
const studentRoutes = require('./Routes/studentRoutes');

if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config({ path:"server/config/config.env"});
}

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', adminRoutes);
app.use('/api/v1', facultyRoutes);
app.use('/api/v1', studentRoutes);

module.exports = app;