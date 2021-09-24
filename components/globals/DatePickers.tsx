import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useDatePickerStyles } from '../../styles/material-ui.styles';

export default function DatePickers({id, label, myDate, changeDate}) {
  const classes = useDatePickerStyles();

  const handleChange = (e) => {
    changeDate(label.toLowerCase(), e.target.value);    
  }

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={id}
        label={label}
        type="date"        
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={myDate}
        onChange={handleChange}
      />
    </form>
  );
}

//Different change handler from above....
export function DatePickersB({id, label, myDate, changeDate}) {
  const classes = useDatePickerStyles();  

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={id}
        label={label}
        type="date"        
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={myDate}
        onChange={changeDate}
      />
    </form>
  );
}
