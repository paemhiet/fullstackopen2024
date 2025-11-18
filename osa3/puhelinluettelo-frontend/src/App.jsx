import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!ok) return

      personService
        .update(existingPerson.id, personObject)
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : updatedPerson))

          setMessage(`Updated ${updatedPerson.name}'s number`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)

          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response?.data || error)
          setMessage(`Information of ${existingPerson.name} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)

          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })

      return
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error.response?.data || error)
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const handleDeletePerson = (id, name) => {
    const ok = window.confirm(`Delete ${name} ?`)
    if (!ok) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))

        setMessage(`Deleted ${name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        console.log(error.response?.data || error)
        setMessage(`Information of ${name} has already been removed from server`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h3>add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        handleDelete={handleDeletePerson}
      />
    </div>
  )
}

export default App
