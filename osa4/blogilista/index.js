require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const mongoUrl = process.env.MONGODB_URI
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
