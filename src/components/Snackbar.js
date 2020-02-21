import * as React from 'react'
import PropTypes from 'prop-types'
import MuiSnackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function Snackbar({ message, severity, ...props }) {
  const [open, setOpen] = React.useState(props.open)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  React.useMemo(() => {
    setOpen(props.open)
  }, [props.open])

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={handleClose}
    >
      {severity && (
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      )}
    </MuiSnackbar>
  )
}

Snackbar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
}
