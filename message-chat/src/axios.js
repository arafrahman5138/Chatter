import axios from 'axios'

const instance = axios.create({
    baseURL:'https://chatter-app-1.herokuapp.com'
})

export default axios