require('dotenv').config()

const Phone = require('./models/phone') 
const express = require('express');
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny')) 
app.use(cors())
app.use(express.static('dist'))

app.get(`/`, (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

app.get('/info', (request, response) => {
    Phone.countDocuments({}).then(count => {
        response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>
        `)
    })
})

app.get('/api/persons', (request, response) => {
    Phone.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Phone.findById(request.params.id)
        .then(person => {
            if (person) response.json(person)
            else response.status(404).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).json({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Phone.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).json({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.phone) {
        return response.status(400).json({ 
            error: 'Отсутствует имя или телефон' 
        })
    }

    Phone.findOne({ $or: [{ name: body.name }, { phone: body.phone }] })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({
                    error: 'Имя или телефон уже существуют в базе'
                })
            }

            const person = new Phone({
                name: body.name,
                phone: body.phone,
            })

            return person.save()
        })
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({ error: 'Ошибка сервера' })
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(` Сервер запущен на порту ${PORT}`)
})