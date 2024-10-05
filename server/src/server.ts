import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Importing the Routes
import routes from './routes/index.js';

// Initializing the Router
const app = express();

// Defining the PORT
const PORT = process.env.PORT || 3001;

// Location of thr Served Static Files
app.use(express.static('../client/dist'));

// Definition for Parsing the JSON Data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Establishing the Connection to the Routes
app.use(routes);

// Starting the Server...
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
