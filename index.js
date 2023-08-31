const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express();

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))
app.use(cors())
app.use(express.static('dist'))

morgan.token('info', (request) =>
    request.method === 'POST' && request.body.name
        ? JSON.stringify(request.body)
        : null
)


let contacts = [
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
]

const generateId = () => {
    const max = 1000000000000
    return Math.floor(Math.random() * max)
}

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(contact => contact.id === id)
    res.json(contact)
})

app.get('/info', (req, res) => {
    const count = contacts.length;
    const time = new Date()
    res.send(`<p>Phonebook has info for ${count} people</p>
                    </br>
                    <p>${time}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const duplicateName = contacts.find(contact => contact.name.toLowerCase().includes(body.name.toLowerCase()))
    console.log(duplicateName)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Something has been missed"
        })
    }

    if (duplicateName) {
        return res.status(400).json({
            error: "This name is already in the phonebook"
        })
    }

    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    contacts = contacts.concat(contact)
    res.json(contact)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`)
})

