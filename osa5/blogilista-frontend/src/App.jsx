import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsFromServer = await blogService.getAll()
      setBlogs(blogsFromServer)
    }

    if (user) {
      fetchBlogs()
    } else {
      setBlogs([])
    }
  }, [user])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      })

      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser)
      )

      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('wrong credentials', error)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    setBlogFormVisible(false)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )
      setBlogFormVisible(false)
    } catch (error) {
      console.log('error creating blog', error)
      showNotification('creating blog failed', 'error')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user.id || blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs(blogs.map(b =>
        b.id !== blog.id ? b : { ...b, likes: returnedBlog.likes }
      ))
    } catch (error) {
      console.log('error updating likes', error)
      showNotification('updating likes failed', 'error')
    }
  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(`removed ${blog.title}`, 'success')
    } catch (error) {
      console.log('error deleting blog', error)
      showNotification('deleting blog failed', 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>
            create new blog
          </button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm createBlog={addBlog} />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification notification={notification} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>
      {blogForm()}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={likeBlog}
            handleDelete={deleteBlog}
          />
        ))}
    </div>
  )
}

export default App
