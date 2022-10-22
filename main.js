const RESTController = require('./Controller/RESTController.js'); 
const FilesController = require('./Controller/FilesController.js'); 

const CSVUtils = require('./Utils/CSVUtils.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.locals.reservations = new Map();

// INITIALIZATION

//add Controller Routes
app.use("/reservations", RESTController);
app.use("/files", FilesController);

function startBootstrap() {

    CSVUtils.addFromCsv(app);
}

//SERVER START
app.listen(PORT, () => {
    startBootstrap();
    console.log(`Hello world app listening on ${PORT}!`);
});

