import {FormControl, InputLabel, MenuItem, Select, Typography} from '@material-ui/core';
import FilterDateRange from './FilterDateRange';
import { transactionTimeFilterI } from '../../../types';
import { useTransactionStyles } from '../../../styles/material-ui.styles';

const TimeFilter = (props:transactionTimeFilterI):JSX.Element => {
  const classes = useTransactionStyles();  
  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Date range"];

  const monthItem = (d, i) => (
    <MenuItem key={i} value={d}>{d}</MenuItem>
  )

  const handleChangeMonth = (e) => {        
    const newMonth = e.target.value;
    if(newMonth!=='Date range'){
      props.dispatchFilter({type:'SET_MONTH', month:newMonth});
    }    
  }

  const handleDispatchDateRange = (startDate, endDate) => {
    props.dispatchFilter({type:'SET_DATE_RANGE', startDate, endDate});
  }  

  const monthSelectText = () => {
    const {dateFilter} = props.transactionFilter;
    const {month, startDate, endDate} = dateFilter;
    if(month!=='Date range'){
      return ''
    }else{
      return startDate===endDate?`Single day : ${startDate}`:`${startDate} to ${endDate}`;
    }
  }

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="select_month_label">
          Select Month
        </InputLabel>
        <Select
          labelId="select_month_label"
          id="select_month"
          value={props.transactionFilter.dateFilter.month}
          onChange={handleChangeMonth}
          displayEmpty
          className={classes.selectEmpty}          
        >
          {months.map(monthItem)}         
        </Select>        
        {
          props.transactionFilter.dateFilter.month === 'Date range' &&
          <Typography variant='caption' gutterBottom>
            {monthSelectText()}
          </Typography>
        }
      </FormControl>
      <FormControl className={classes.formControl}> 
        <FilterDateRange transactionFilter={props.transactionFilter} dispatchDateRange={handleDispatchDateRange} />     
      </FormControl>      
    </>
  )
}

export default TimeFilter;