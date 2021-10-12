import React from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core/';
import TimeFilter from './TimeFilter';
import {transactionSortFilterComponentI} from "../../../types";
import { useTransactionStyles } from '../../../styles/material-ui.styles';
import CategoryAndSubFilter from './CategoryAndSubFilter';

export default function TransactionSortFilter({
                                    categories, 
                                    sort, 
                                    dispatchSort, 
                                    filter, 
                                    dispatchFilter
                                  }:transactionSortFilterComponentI):JSX.Element {
  const classes = useTransactionStyles();  

  const handleChangeSort = () => {
    dispatchSort({type:'TOGGLE_SORT'});
  }

  return (
    <div className={classes.controlContainer} >            
      <CategoryAndSubFilter 
        categories={categories} 
        transactionFilter={filter} 
        dispatchFilter={dispatchFilter} 
      />      
      <TimeFilter 
        transactionFilter={filter} 
        dispatchFilter={dispatchFilter} 
      />
      <FormControl className={classes.formControl}>
        <InputLabel id="sort-label" className={classes.formInput}>Sort By</InputLabel>
        <Select
          className={classes.formInput}
          labelId="sort-label"
          id="sort-select"
          value={sort.sortBy}
          onChange={handleChangeSort}
        >
          <MenuItem value={"Amount"}>Amount</MenuItem>
          <MenuItem value={"Date"}>Date</MenuItem>          
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Button 
          className={classes.formInput}
          variant="contained" 
          size="small" 
          color="secondary"          
          onClick={()=>dispatchFilter({type:'RESET_FILTER'})}
        >
          Reset
        </Button>
      </FormControl>
    </div>
  );
}



