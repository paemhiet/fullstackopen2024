import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  const canRemove =
    user &&
    blog.user &&
    typeof blog.user === 'object' &&
    blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>view</button>
      </div>

      <div style={showWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>hide</button>

        <div>{blog.url}</div>

        <div>
          likes {blog.likes}{' '}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>

        <div>{blog.user && blog.user.name ? blog.user.name : null}</div>

        {canRemove && (
          <button onClick={() => handleDelete(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog