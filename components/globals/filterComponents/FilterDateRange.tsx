import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { Button, Drawer, Divider, FormControl, FormLabel} from '@material-ui/core/';
import DatePickers from '../DatePickers';
import { useDateRangeStyles } from '../../../styles/material-ui.styles';

export default function FilterDateRange({transactionFilter, dispatchDateRange}) {
  const classes = useDateRangeStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [dateFrom, setFrom] = useState<string>('');
  const [dateTo, setTo] = useState<string>('');
  const [editDirty, setEditDirty] = useState<boolean>(false);

  useEffect(()=>{
    if(state.right){
      initializeDateRange();
    }    
  }, [state.right]);

  const initializeDateRange = () => {
    const {dateFilter:{startDate, endDate}} = transactionFilter;
    setFrom(startDate);
    setTo(endDate);
    setEditDirty(false);
  }

  const changeDate = (dateState, newDate) => {
    if(dateState==='from' && dateFrom!==newDate){
      if(dateTo!==''){
        const dateObjFrom = new Date(newDate);
        const dateObjTo = new Date(dateTo);

        if(dateObjFrom > dateObjTo){
          setFrom(dateTo)
        }else{
          setFrom(newDate);
        }
      }else{
        setFrom(newDate);
      }
      if(!editDirty){setEditDirty(true)}
    }

    if(dateState==='to' && dateTo!==newDate){
      if(dateFrom!==''){        
        const dateObjFrom = new Date(dateFrom);
        const dateObjTo = new Date(newDate);

        if( dateObjTo < dateObjFrom){          
          setTo(dateFrom)
        }else{
          setTo(newDate);
        }
      }else{
        setTo(newDate);
      }
      if(!editDirty){setEditDirty(true)}
    }
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    
    setState({ ...state, [anchor]: open });
  };  

  const list = () => (
    <div
      className={clsx(classes.list, {[classes.fullList]: false})}
      role="presentation"      
    >              
      <TimeSelection dateFrom={dateFrom} dateTo={dateTo} changeDate={changeDate} />
      <Divider />
      <div className={classes.buttonContainer} >
        <Button variant="contained" color="primary" size="small"
          onClick={(e)=>{
            toggleDrawer('right', false)(e);
            dispatchDateRange(dateFrom, dateTo);
            setEditDirty(false);            
          }}          
          onKeyDown={toggleDrawer('right', false)}
          disabled={!editDirty || dateTo==='' || dateFrom===''}
        >
          Apply
        </Button>        
        <Button variant="contained" color="primary" size="small"
          onClick={initializeDateRange}          
          disabled={!editDirty}          
        >
          Reset
        </Button>
        <Button variant="contained" color="secondary" size="small"
          onClick={toggleDrawer('right', false)}
          onKeyDown={toggleDrawer('right', false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div>     
      <>
        <Button onClick={toggleDrawer('right', true)}>Date Range</Button>
        <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
          {state.right && list()}
        </Drawer>
      </>      
    </div>
  );
}

const TimeSelection = ({dateFrom, dateTo, changeDate}) => {
  const classes = useDateRangeStyles();
  
  return (
    <FormControl className={classes.drawerControl} component="fieldset">
      <FormLabel component="legend">Filter Date Range</FormLabel>
      <DatePickers id={"start-date"} label={"From"} myDate={dateFrom} changeDate={changeDate} />
      <DatePickers id={"end-date"} label={"To"} myDate={dateTo} changeDate={changeDate}  />
    </FormControl>     
  )
}
