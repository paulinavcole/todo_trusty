const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');

// declare app
const app = express();
const port = 4999;

// middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// default route
app.get('/', (req, res) => res.status(200).send({
    message: 'Server is running!'
}));

const WriteTextToFile = async (content) => {
    fs.writeFile('./src/data.json', content, (err) => {
        console.log(content);
        if (err) {
            console.log(err);
        } else {
            console.log('written to file');
        }
    });
}

// post route
app.post('/write', async(req, res, next) => {
    const requestContent = JSON.stringify(req.body);
    await WriteTextToFile(requestContent);
});

// 404 route
app.use((req, res, next) => res.status(404).send({
    message: 'Page not found!'
}));

// run server
app.listen(port, () => {
    console.log(`
    listening on port ${port}
    http://localhost:4999
    `
    )
});