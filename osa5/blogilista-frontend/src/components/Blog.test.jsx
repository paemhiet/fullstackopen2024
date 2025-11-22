import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> component tests', () => {
  test('renders title and author, but not url or likes by default', () => {
    const blog = {
      title: 'Testing React components',
      author: 'Jane Developer',
      url: 'http://example.com',
      likes: 10,
      user: { name: 'Test User', username: 'tester' },
      id: '123',
    }

    const user = {
      name: 'Test User',
      username: 'tester',
    }

    const mockLike = vi.fn()
    const mockDelete = vi.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        handleLike={mockLike}
        handleDelete={mockDelete}
      />
    )

    const titleElements = screen.getAllByText('Testing React components', {
      exact: false,
    })
    expect(titleElements[0]).toBeVisible()

    const authorElements = screen.getAllByText('Jane Developer', {
      exact: false,
    })
    expect(authorElements[0]).toBeVisible()

    const urlElement = screen.getByText('http://example.com')
    expect(urlElement).not.toBeVisible()

    const likesElement = screen.getByText('likes 10', { exact: false })
    expect(likesElement).not.toBeVisible()
  })

  test('shows url, likes and user after clicking view button', async () => {
    const blog = {
      title: 'Testing details',
      author: 'Detail Developer',
      url: 'http://example.com/details',
      likes: 5,
      user: { name: 'Test User', username: 'tester' },
      id: '456',
    }

    const userLoggedIn = {
      name: 'Test User',
      username: 'tester',
    }

    render(
      <Blog
        blog={blog}
        user={userLoggedIn}
      />
    )

    const userSim = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userSim.click(viewButton)

    const urlElement = screen.getByText('http://example.com/details')
    expect(urlElement).toBeVisible()

    const likesElement = screen.getByText('likes 5', { exact: false })
    expect(likesElement).toBeVisible()

    const userElement = screen.getByText('Test User')
    expect(userElement).toBeVisible()
  })

  test('calls like handler twice when like button is clicked twice', async () => {
    const blog = {
      title: 'Testing likes',
      author: 'Like Tester',
      url: 'http://example.com',
      likes: 0,
      user: { name: 'Test User', username: 'tester' },
      id: 'xyz123',
    }

    const userLoggedIn = {
      name: 'Test User',
      username: 'tester',
    }

    const mockLike = vi.fn()
    const mockDelete = vi.fn()

    render(
      <Blog
        blog={blog}
        user={userLoggedIn}
        handleLike={mockLike}
        handleDelete={mockDelete}
      />
    )

    const userSim = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userSim.click(viewButton)

    const likeButton = screen.getByText('like')
    await userSim.click(likeButton)
    await userSim.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})