const express = require('express');
const port = 1234;
const app = express();
const dbConnect = require('./config/dbConnection');

app.use(express.urlencoded());

app.use('/', require('./routes/index.routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server is running on port http://localhost:${port}`);
    }
});    