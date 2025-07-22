const express = require('express');
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny')) 
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get(`/`, (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}`)
})

app.get('/api/persons', (request, response) => {
        response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else{
         response.status(404).end();
        //  console.log(responsestatus(404).end())

    
    }

})

app.delete('/api/persons/:id', (request, response) =>{
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id)

    response.status(204).end();
})

const generateId = () => {
const id = `id-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

console.log(id);
return String(id);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;


        if (!body.name || !body.phone ) {
        return response.status(400).json({
            error: 'Отсутствует имя или телефон'
        })
    }

    const nameExists = persons.some(person => person.name === body.name);
    const phoneExists = persons.some(person => person.phone === body.phone);

    if (nameExists || phoneExists) {
        return response.status(400).json({
            error: 'Имя или телефон уже существуют в базе'
        })
    }
        const person ={
        id : generateId(),
        name : body.name,
        phone: body.phone,
    }

    persons = persons.concat(person);
    
    response.json(person)
    console.log(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(` Сервер запущен на порту ${PORT}`)

})