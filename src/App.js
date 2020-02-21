import * as React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import fetch from 'unfetch'
import Header from './components/Header'
import Snackbar from './components/Snackbar'
import Table from './components/Table'

const API_URL = 'https://reqres.in/api'

const properties = {
  name: {
    type: 'string',
    label: 'Name',
  },
  email: {
    type: 'string',
    label: 'Email',
  },
}

export default function App() {
  const [users, setUsers] = React.useState([])
  const [message, setMessage] = React.useState(null)

  const handleDelete = async row => {
    try {
      const res = await fetch(`${API_URL}/users/${row.id}`, {
        method: 'DELETE',
      })

      if (res.status === 204) {
        setMessage({
          message: 'User successfuly deleted!',
          severity: 'success',
        })
      } else {
        throw new Error('Cannot delete user!')
      }
    } catch (error) {
      setMessage({
        severity: 'error',
      })
    }
  }

  const fetchUsers = async () => {
    const res = await fetch(API_URL + '/users?per_page=5')

    if (res.status === 200) {
      const collection = await res.json()
      const data = collection.data.map(user => ({
        name: `${user.first_name} ${user.last_name}`,
        ...user,
      }))

      setUsers(data)
    } else {
      setMessage({
        message: 'Cannot fetch users, please try again.',
        severity: 'error',
      })
    }
  }

  React.useEffect(() => {
    const clearMessage = () => setTimeout(() => setMessage(null), 3000)

    if (message) {
      clearMessage()
    }

    return () => {
      clearTimeout(clearMessage)
    }
  }, [message])

  React.useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <React.Fragment>
      <Header />
      <Box mb={5} />
      <Container maxWidth="md">
        <Table properties={properties} data={users} onDelete={handleDelete} />
      </Container>
      {message && <Snackbar open {...message} />}
    </React.Fragment>
  )
}
