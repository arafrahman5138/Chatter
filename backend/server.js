// imports
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoData from './Schemas/messageSchema.js'

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1211273",
    key: "efea9d1d752dba7cb8ff",
    secret: "745a16ed8966de9e942a",
    cluster: "us2",
    useTLS: true
  });

//middleware
app.use(cors())
app.use(express.json())

//db config
const connection_url = 'mongodb+srv://arafrahman:arafrahman@cluster0.8ufpl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db  = mongoose.connection

db.once('open', () => {
    console.log("DB connected")

    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
        } else if (change.operationType === 'update') {
            pusher.trigger('messages', 'newMessage', {
                'change': change
            })
        } else {
            console.log('Error triggering Pusher...')
        }
    })
})

//api routes
app.get('/', (req, res) => res.status(200).send('hello world'))

app.post('/new/conversation', (req, res) => {
    const dbData = req.body

    mongoData.create(dbData, (err, data) => {
        if(err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
})

app.post('/new/message', (req, res) => {   
    mongoData.update(
    { _id: req.query.id },
    { $push: {conversation: req.body } },
    (err, data) => {
        if(err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
})

app.get('/get/conversationList', (req, res) => {
    mongoData.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        }
        else {
            data.sort((b, a) => {
                return a.timeStamp - b.timeStamp
            })

            let conversations = []
            data.map((conversationData) => {
                const conversationInfo = {
                    id: conversationData._id,
                    name: conversationData.chatName,
                    timeStamp: conversationData.conversation[0]?.timeStamp
                }
                conversations.push(conversationInfo)
            })
            res.status(200).send(conversations)
        }
    })
})

app.get('/get/conversation', (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
})

app.get('/get/lastMessage', (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            let convData = data[0].conversation

            convData.sort((b, a) => {
                return a.timeStamp - b.timeStamp
            })

            res.status(200).send(convData[0])
        }
    })
})

//listen
app.listen(port, () => console.log(`Listening on: ${port}`))