const Reservation = require('../Model/Reservation.js');

const fs = require('fs');

const RES_CSV_DIR = `${__dirname }/../DB`;
const RES_CSV = `storage.csv`;
const RESERVATION_MODEL = Object.getOwnPropertyNames(new Reservation());

class CSVUtils {

    static stringify = require('csv-stringify').stringify;
    static stringifySync = require('csv-stringify/sync').stringify;
    static parse = require('csv-parse/sync').parse;

    static addFromCsv(app, filePath = `${RES_CSV_DIR}/${RES_CSV}`, reference = RESERVATION_MODEL) {

        const data = fs.readFileSync(filePath);
        let records = CSVUtils.parse(data, { columns: reference, skip_empty_lines: true, skip_records_with_error: true });

        [...records].forEach((item) => {

            app.locals.reservations.set(Number(item.id), new Reservation(item));
        });
    }

    static csvSave(app, destDir = RES_CSV_DIR, destFile = RES_CSV) {

        CSVUtils.stringify([...app.locals.reservations.values()], function (err, str) {

            //create the files directory if it doesn't exist
            if (!fs.existsSync(destDir)) {

                fs.mkdirSync(destDir);
            }
            fs.writeFile(`${destDir}/${destFile}`, str, function (err) { });
        });
    }
}

module.exports = CSVUtils;