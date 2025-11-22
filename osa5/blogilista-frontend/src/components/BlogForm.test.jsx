import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with correct details when submitted', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testblog.example.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  const callArg = createBlog.mock.calls[0][0]
  expect(callArg.title).toBe('Test Blog Title')
  expect(callArg.author).toBe('Test Author')
  expect(callArg.url).toBe('http://testblog.example.com')
})