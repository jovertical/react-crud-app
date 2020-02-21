import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
}))

export default function MyTable({ properties, data, onEdit, onDelete }) {
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {properties &&
              Object.keys(properties).map((prop, n) => (
                <TableCell key={`${prop}-${n}`} component="th">
                  <Typography>{properties[prop].label}</Typography>
                </TableCell>
              ))}
            <TableCell component="th" align="right">
              <Typography>Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row, n) => (
              <TableRow key={n}>
                {Object.keys(properties).map((prop, n) => (
                  <React.Fragment key={n}>
                    {n === 0 ? (
                      <TableCell component="th" scope="row">
                        {row[prop]}
                      </TableCell>
                    ) : (
                      <TableCell>{row[prop]}</TableCell>
                    )}
                  </React.Fragment>
                ))}

                <TableCell align="right">
                  <IconButton onClick={() => onEdit && onEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete && onDelete(row)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

MyTable.propTypes = {
  properties: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}
