const Person = ({ person, handleDelete }) => (
  <div>
    {person.name} {person.number}{' '}
    <button onClick={() => handleDelete(person.id, person.name)}>
      delete
    </button>
  </div>
)

export default Person
