const express = require('express');
const Reservation = require('../Model/Reservation');
const router = express.Router();

const CSVUtils = require('../Utils/CSVUtils.js');

router.get('/', (req, res) => {

    res.json([...req.app.locals.reservations.values()]);
});

router.get('/:id', (req, res) => {

    const ID = Number(req.params.id);

    let found = req.app.locals.reservations.get(ID);

    if (found === undefined) {

        res.status(404).send('Reservation not found!');
        return;
    }

    res.status(200).json(found);
});

router.get('/date/:date', (req, res) => {

    const DATE = String(req.params.date);

    res.status(200).json([...req.app.locals.reservations.values()].filter((item) => {

        return item.date === DATE;
    }));
});

router.delete('/:id', (req, res) => {

    const ID = Number(req.params.id);
    let deleted = req.app.locals.reservations.delete(ID);

    if (!deleted) {

        res.status(404).send('Reservation not found!');
        return;
    }

    CSVUtils.csvSave(req.app);
    res.status(200).send('Reservation deleted');
});

router.delete('/', (req, res) => {

    req.app.locals.reservations.clear();

    CSVUtils.csvSave(req.app);
    res.status(200).send('Reservations purged!');
});

router.put('/:id', (req, res) => {

    if (!Reservation.isValid(req.body, Reservation.strictValidationSchema)) {
        
        res.status(400).send('Invalid Data!');
        return;
    }
    
    const ID = Number(req.params.id);
    const NEW_RES = new Reservation(req.body);

    req.app.locals.reservations.set(ID, NEW_RES);

    CSVUtils.csvSave(req.app);
    res.status(200).send('Book has been edited/inserted!');
});

router.post('/', (req, res) => {

    if (!Reservation.isValid(req.body, Reservation.looseValidationSchema)) {

        res.status(400).send('Invalid Data!');
        return;
    }

    let genId = null;

    do {

        genId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    } while (req.app.locals.reservations.has(genId));    

    const NEW_RES = new Reservation(req.body);
    NEW_RES.id = genId;
    
    req.app.locals.reservations.set(NEW_RES.id, NEW_RES);
    
    CSVUtils.csvSave(req.app);
    res.status(201).send('Reservation confirmed!');
});

module.exports = router;