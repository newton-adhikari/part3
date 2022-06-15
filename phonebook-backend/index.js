const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const { response } = require("express");

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

const errorHanlder = (error, request, response, next) => {
    console.log(error.message);

    if(error.name === "CastError") {
        return response.status(400).send("malformed id");
    }
    next(error);
}

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

app.get("/api/persons", (req, res, next) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => next(err))
})

app.get("/api/persons/:id", (req, res, next) => {
    // const id = Number(req.params.id);
    // const person = persons.find(p => p.id === id);
    // if(!person) return res.status(400).end();
    // res.json(person);

    User.findById(req.params.id)
        .then(user => {
            if(!user) return res.status(400).json({error: "can't find the user"})
            res.json(user);
        })
        .catch(err => next(err))
})

app.post("/api/persons", (req, res) => {
    // const id = persons.length > 0
    //     ? Math.max(...persons.map(p => p.id))
    //     : 0
    // const uniqueId = id + 1;

    // if(!Object.keys(req.body).includes("name") || !Object.keys(req.body).includes("number")) {
    //     return res.status(400).json({error: "name or number is missing"});
    // }

    // const {name} = req.body;
    // const existingUser = persons.find(p => p.name === name);
    // if(existingUser) return res.status(400).json({error: `${name} already exists`});

    // const person = {id: uniqueId, ...req.body};
    // persons = persons.concat(person);
    // res.status(201).json(person);

    if(!req.body) return res.status(400).json({error: "body is missing"});
    if(!Object.keys(req.body).includes("name") || !Object.keys(req.body).includes("number")) {
        return res.status(400).json({error: "name or number fields are missing"})
    }
    const user = new User(req.body);
    user.save().then(newUser => res.status(201).json(newUser));
})

app.put("/api/persons/:id", (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(updatedUser => res.json(updatedUser))
        .catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res,next) => {
    // const id = Number(req.params.id);
    // const person = persons.find(p => p.id === id);

    // if(!person) return res.status(400).end();
    // persons = persons.filter(p => p.id !== id);
    // res.end();

    User.findByIdAndRemove(req.params.id)
        .then(response => res.status(204).end())
        .catch(err => next(err))
})

app.get("/info", (req, res) => {
    const response = `
    <p>phonebook has info for ${persons.length} people</p>${new Date()}
    `;
    res.send(response);
})

app.use(errorHanlder);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`);
})