const { describe, test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

require('dotenv').config()

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Testiblogi 1',
    author: 'Testaaja',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    title: 'Testiblogi 2',
    author: 'Toinen Testaaja',
    url: 'http://example.com/2',
    likes: 10,
  },
]

before(async () => {
  const mongoUrl = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI
  await mongoose.connect(mongoUrl)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('when there are some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

test('blog unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert.ok(blog.id)          
  assert.strictEqual(blog._id, undefined) 
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Uusi testiblogi',
      author: 'Lisääjä',
      url: 'http://example.com/new',
      likes: 7,
    }

    const blogsAtStart = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(
      blogsAtEnd.body.length,
      blogsAtStart.body.length + 1
    )

    const titles = blogsAtEnd.body.map((b) => b.title)
    assert.ok(titles.includes('Uusi testiblogi'))
  })
})

describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(
      blogsAtEnd.body.length,
      blogsAtStart.body.length - 1
    )

    const ids = blogsAtEnd.body.map((b) => b.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })
})

after(async () => {
  await mongoose.connection.close()
})
