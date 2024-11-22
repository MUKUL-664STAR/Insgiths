const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const insightRoutes = require('./routes/insights');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/insights', insightRoutes);

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

module.exports = app;
