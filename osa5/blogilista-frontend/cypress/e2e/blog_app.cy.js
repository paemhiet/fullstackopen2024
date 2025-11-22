describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'sekret',
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('input[name="Username"]').should('exist')
    cy.get('input[name="Password"]').should('exist')
    cy.contains('login').should('exist')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('sekret')
      cy.contains('login').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('wrongpassword')
      cy.contains('login').click()

      cy.contains('wrong username or password')
      cy.contains('Test User logged in').should('not.exist')
    })
  })
})