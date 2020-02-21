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
  const [editing, setEditing] = React.useState(false)
  const [activeUser, setActiveUser] = React.useState(null)

  const handleEdit = row => {
    setActiveUser(row)
    setEditing(true)
  }

  const handleUpdate = async fields => {
    try {
      const res = await fetch(`${API_URL}/users/${activeUser.id}`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(fields),
      })

      if (res.status === 200) {
        const updatedUser = await res.json()
        setUsers(
          users.map(user => {
            if (user.id === activeUser.id) {
              return updatedUser
            }

            return user
          }),
        )

        setEditing(false)
        setMessage({
          message: 'User successfuly updated!',
          severity: 'success',
        })
      } else {
        throw new Error('Cannot update User!')
      }
    } catch (error) {
      setMessage({
        message: error.message,
        severity: 'error',
      })
    }
  }

  const handleCreate = async fields => {
    try {
      const res = await fetch(API_URL + '/users', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(fields),
      })

      if (res.status === 201) {
        const newUser = await res.json()
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
        const filtered = users.filter(user => user.id !== row.id)
        setUsers(filtered)

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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>
      {message && <Snackbar open {...message} />}
      {editing && (
        <FormDialog
          open
          onSave={handleUpdate}
          title="Update a User"
          defaultValues={{
            first_name: activeUser.first_name || '',
            last_name: activeUser.last_name || '',
            email: activeUser.email || '',
          }}
          onClose={() => setEditing(false)}
        />
      )}
      {creating && (
        <FormDialog
          open
          onSave={handleCreate}
          title="Create a New User"
          defaultValues={{
            first_ame: '',
            last_name: '',
            email: '',
          }}
          onClose={() => setCreating(false)}
        />
      )}
    </React.Fragment>
  )
}
