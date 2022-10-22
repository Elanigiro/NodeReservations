
class Reservation {

    static strictValidationSchema = {

        id: (val) => !isNaN(val),
        date: (val) => Boolean(val),
        room: (val) => !isNaN(val),
        firstname: (val) => Boolean(val),
        lastname: (val) => Boolean(val)
    }

    static looseValidationSchema = {

        date: (val) => Boolean(val),
        room: (val) => !isNaN(val),
        firstname: (val) => Boolean(val),
        lastname: (val) => Boolean(val)
    }

    /** @type {number} */
    id;
    /** @type {string} */
    date;
    /** @type {number} */
    room;
    /** @type {string} */
    firstname;
    /** @type {string} */
    lastname;

    /**
     * @param {Object} obj 
     */
    constructor(obj) {

        if(obj) {

            this.id = Number(obj.id);
            this.date = String(obj.date);
            this.room = Number(obj.room);
            this.firstname = String(obj.firstname);
            this.lastname = String(obj.lastname);
        }
    }

    /**
     * @param {Object} obj 
     * @param {Object} schema
     * @return {boolean}
     */
    static isValid(obj, schema) {

        let errors = Object.getOwnPropertyNames(schema)
            .filter((key) => (obj[key]) ? !schema[key](obj[key]) : true);

        return (errors.length)? false : true;
    }
}

//Exports class Reservation (it basically exports the Function constructor)
module.exports = Reservation;