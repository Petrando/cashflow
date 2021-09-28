import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { tablePagingI } from '../../types';

export default function TablePaging({handlePageChange, page, count}:tablePagingI):JSX.Element {  
  const rowsPerPage = 5;

  const handleChangeRowsPerPage = (event) => {
    //setRowsPerPage(parseInt(event.target.value, 10));
    //setPage(0);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(e, newPage) =>{handlePageChange(newPage)}}  
      rowsPerPage={rowsPerPage}    
      rowsPerPageOptions={[5]}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
}