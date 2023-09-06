const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res.status(404).json({ message: 'Hello from the server side !', app: 'Natours' });
// })

// app.post('/', (req, res) => {
//     res.status(200).send('You can post to this end point ... ');
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        tours
    });
})

const port = 3000;

app.listen(port, () => {
    console.log(`App is runing on ${port} ... `,);
})