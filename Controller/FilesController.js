const express = require('express');
const router = express.Router();

const multer = require('multer');
const os = require('os');
const CSVUtils = require('../Utils/CSVUtils');
const upload = multer({ dest: os.tmpdir() });

router.get('/', (req, res) => {

    let resArray = [...req.app.locals.reservations.values()];

    if (req.query.today) {

        let currentDate = (new Date()).toLocaleDateString("sv-SE");

        resArray = resArray.filter((item) => {

            return item.date === currentDate;
        });
    }

    res.status(200).setHeader("Content-type", "text/csv").send(CSVUtils.stringifySync(resArray));
});

module.exports = router;