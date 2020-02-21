import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

const useStyles = makeStyles(theme => ({
  dialog: {
    width: 500,
  },
}))

export default function Form({
  title,
  defaultValues,
  onClose,
  onSave,
  ...props
}) {
  const styles = useStyles()
  const [open, setOpen] = React.useState(props.open || false)
  const [firstName, setFirstName] = React.useState(defaultValues.first_name)
  const [lastName, setLastName] = React.useState(defaultValues.last_name)
  const [email, setEmail] = React.useState(defaultValues.email)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent className={styles.dialog}>
          <Box mb={1}>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              label="First name"
              type="text"
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
            />
          </Box>
          <Box mb={1}>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              label="Last name"
              type="text"
              value={lastName}
              onChange={event => setLastName(event.target.value)}
            />
          </Box>
          <Box mb={1}>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave &&
              onSave({ first_name: firstName, last_name: lastName, email })
            }
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

Form.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  defaultValues: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
}
