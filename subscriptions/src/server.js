const express = require('express')
const app = express()

const port = process.env.WEB_PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`subscriptions api ready`);
})
