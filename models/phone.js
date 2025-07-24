require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('подключение к', url)
mongoose.connect(url)
  .then(result => {
    console.log('подключение к MongoDB')
  })
  .catch(error => {
    console.log('ошибка подключения к MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: String,
  phone: String,
}, { collection: 'persons' }) 

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', phoneSchema)