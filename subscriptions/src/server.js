const mongoose = require('mongoose');
const express = require('express')
const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const subscriptionRoutes = require('./routes/subscriptions.js');
app.use('/api', subscriptionRoutes);

// Start server with mongodb connection
mongoose.connect('mongodb://mongo:27017/subscriptions', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    })
    .catch((error) => {
        console.error(`Can't connect to mongodb`);
        process.exit(1);
    });

app.listen(port, () => {
    console.log(`subscriptions api ready`);
})

module.exports = app;