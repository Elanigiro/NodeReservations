# NodeReservations

This is a NodeJS application based on the Express web framework.

The application allows the user to manage a list of reservations with an easy-to-use interface.

## Backend

The <strong>Backend</strong> is fairly simple:
 - <em>RESTController.js</em> is used to manage all the CRUD operations on the data
 - <em>FilesController.js</em> is used to retrieve the data (or a subset) as a CSV file
 - The data is managed in memory (Map object) and is persisted in a CSV file kept in sync at every operation

##### <em> Note: All GET/PUT/DELETE ops respect idempotency </em>

## Frontend

The <strong>Frontend</strong> takes advantage of Bootstrap and custom JavaScript code to manage both the presentation layer and the client-side logic.

Finally, the Fetch API takes care of all the HTTP calls to the Backend.

### External resources and dependencies:
- Express
- Bootstrap
- body-parser
- cors
- csv-parse
- csv-stringify
- multer
- nodemon
- os

<!-- ![alt text](https://github.com/Elanigiro/QuizGame/blob/master/screens/1.png) -->