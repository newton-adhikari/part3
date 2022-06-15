const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");

morgan.token('body', req => {
    return JSON.stringify(req.body)
})  

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/api/persons", (req, res) => {
    User.find({})
        .then(users => res.json(users));
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if(!person) return res.status(400).end();
    res.json(person);
})

app.post("/api/persons", (req, res) => {
    const id = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    const uniqueId = id + 1;

    if(!Object.keys(req.body).includes("name") || !Object.keys(req.body).includes("number")) {
        return res.status(400).json({error: "name or number is missing"});
    }

    const {name} = req.body;
    const existingUser = persons.find(p => p.name === name);
    if(existingUser) return res.status(400).json({error: `${name} already exists`});

    const person = {id: uniqueId, ...req.body};
    persons = persons.concat(person);
    res.status(201).json(person);
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if(!person) return res.status(400).end();
    persons = persons.filter(p => p.id !== id);
    res.end();
})

app.get("/info", (req, res) => {
    const response = `
    <p>phonebook has info for ${persons.length} people</p>${new Date()}
    `;
    res.send(response);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`);
})