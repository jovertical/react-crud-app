import * as React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import fetch from 'unfetch'
import FormDialog from './components/Dialogs/Form'
import Header from './components/Header'
import Snackbar from './components/Snackbar'
import Table from './components/Table'

const API_URL = 'https://reqres.in/api'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

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
  const [creating, setCreating] = React.useState(false)

  const handleCreate = async fields => {
    try {
      const res = await fetch(API_URL + '/users', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(fields),
      })

      if (res.status === 201) {
        const data = await res.json()
        const newUser = {
          id: data.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          created_at: data.createdAt,
        }
        setUsers([newUser].concat(users.splice(0, users.length - 1)))

        setCreating(false)
        setMessage({
          message: 'User successfuly created!',
          severity: 'success',
        })
      } else {
        throw new Error('Cannot create User!')
      }
    } catch (error) {
      setMessage({
        message: error.message,
        severity: 'error',
      })
    }
  }

  const handleDelete = async row => {
    try {
      const res = await fetch(`${API_URL}/users/${row.id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
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
        message: error.message,
        severity: 'error',
      })
    }
  }

  const fetchUsers = async () => {
    const res = await fetch(API_URL + '/users?per_page=5')

    if (res.status === 200) {
      const collection = await res.json()
      setUsers(collection.data)
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
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreating(true)}
          >
            Create
          </Button>
        </Box>
      </Container>
      <Box mb={2} />
      <Container maxWidth="md">
        <Table
          properties={properties}
          data={users.map(user => ({
            ...user,
            name: `${user.first_name || ''} ${user.last_name || ''}`,
          }))}
          onDelete={handleDelete}
        />
      </Container>
      {message && <Snackbar open {...message} />}
      {creating && (
        <FormDialog
          open
          onSave={handleCreate}
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
          }}
          onClose={() => setCreating(false)}
        />
      )}
    </React.Fragment>
  )
}
