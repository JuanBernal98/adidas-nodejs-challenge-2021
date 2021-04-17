const express = require('express')
const app = express();


const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const subscriptionRoutes = require('./routes/subscriptions.js');
app.use('/api', subscriptionRoutes);

app.listen(port, () => {
    console.log(`subscriptions api ready`);
})