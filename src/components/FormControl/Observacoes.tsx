import { makeStyles, TextField } from '@material-ui/core'
import React from 'react'

const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  input: {
    color: '#555555',
    display: 'block',
    width: '100%',
    background: 'transparent',
  },
}));

type Props = {
  numLinhas: number,
  value: string,
  setValue?: (v: any) => void,  
}

const Observacoes = (props: Props) => {
  const classes = useStyles();
  const uuid = uuidv4();

  const { value, setValue, numLinhas } = props;

  return (
    <TextField
      id={uuid}
      name={uuid}
      variant="outlined"
      type="text"      
      className={classes.input}
      fullWidth
      autoComplete="off"
      multiline
      rows={numLinhas}
      value={value || ''}
      onChange={(event) => setValue && setValue(event.target.value)}
    />
  )
}

export default Observacoes
