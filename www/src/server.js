const express = require('express');
const axios = require('axios');
const app = express();

var port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Subscriptions API 
-------------------------------- */
axios.defaults.baseURL = 'http://subscriptions:3000/api';

// Creates new subscriptions
app.post('/subscription/new', (req, res) => {
    var subscription = req.body;
    axios.post('/subscription', subscription)
        .then(function (response) {
            var id = response.data // new subscription id
            res.send(id);
        })
        .catch(function (error) {
            res.send(error.data);
        });
});

app.listen(port, () => {
    console.log(`www container server ready`);
})