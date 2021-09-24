import React from 'react';
import Alert from '@material-ui/lab/Alert';
import {useCommonStyles} from "../../styles/material-ui.styles"
import { showAlertI} from "../../types";

export default function ShowAlert({severity, label, handleClose}:showAlertI):JSX.Element {
  const classes = useCommonStyles();

  return (
    <div className={classes.root} onClick={()=>{handleClose && handleClose()}}>
      <Alert severity={ 
                       severity==="error"?"error":
                       severity==="warning"?"warning":
                       severity==="info"?"info":
                       "success"
                       }>
            { label }
      </Alert>
    </div>
  );
}
