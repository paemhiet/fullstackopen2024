const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')   

const Blog = require('./models/blog')
const User = require('./models/user')   
const loginRouter = require('./controllers/login')   

const app = express()

app.use(express.json())
app.use('/api/login', loginRouter)

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)

  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

app.delete('/api/blogs/:id', async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)

  response.status(204).end()
})

app.get('/api/users', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })

  response.json(users)
})

app.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = app
