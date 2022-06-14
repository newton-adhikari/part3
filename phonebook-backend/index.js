const express = require("express");
const app = express();

app.use(express.json());

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
    res.json(persons);
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`);
})