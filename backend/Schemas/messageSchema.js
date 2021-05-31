import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    chatName: String,
    conversation: [
        {
            message: String,
            timeStamp: String,
            user: {
                displayName: String,
                email: String,
                photo: String,
                uid: String
            }
        }
    ]
})

export default mongoose.model('conversations', messageSchema)