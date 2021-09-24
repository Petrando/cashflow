import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import { LoadingDiv } from "../globals/LoadingBackdrop";
import { getTransactionCount } from "../../api/categoryApi";
import { deleteSubCategoryI } from "../../types";

function DeleteSubCategoryDialog({
                                    cancelDelete, 
                                    deleteSub, 
                                    categoryId, 
                                    categoryName, 
                                    subToDelete:{_id, name} 
                                  }:deleteSubCategoryI):JSX.Element {      
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [isCountingTransaction, setIsCountingTransaction] = useState<boolean>(true);
    const [transactionCount, setTransactionCount] = useState<number>(0);
  
    useEffect(()=>{  
        getTransactionCount(categoryId, _id)
            .then(data=>{
                if(typeof data === 'undefined'){
                    console.log('No connection!?');
                    setIsCountingTransaction(false);
                    return;
                }
                if(data.error){
                    console.log(data.error)
                }else{
                    const {transactionCount} = data;  				
                    setTransactionCount(transactionCount);
                }
                setIsCountingTransaction(false);
            })
    }, []);
  
    return (
      <Dialog fullWidth={true} maxWidth={'sm'}
        onClose={()=>{}} aria-labelledby="simple-dialog-title" open={true}>
        <DialogTitle id="simple-dialog-title">
          {isCountingTransaction?'Counting transactions....':
                                  transactionCount===0?'Delete this sub category?':
                                                       'There are transaction(s)'}        
        </DialogTitle>
        <DialogContent>
          {
            isCountingTransaction && <LoadingDiv />
          }
          {
            !isCountingTransaction &&
            transactionCount === 0 &&
            <>      	
              {name} in {categoryName}
            </>                
          }
          {
            !isCountingTransaction &&
            transactionCount > 0 &&
            <>      	
              {transactionCount} transaction(s) under {name} in {categoryName}. Cannot delete.
            </>                
          }       	        
        </DialogContent>
        <DialogActions>
          {
            transactionCount === 0 &&
            <Button 
              onClick={deleteSub} 
              color="primary"  
              disabled={isCountingTransaction}        
            >
              Delete
            </Button>
          }        
          <Button 
            onClick={()=>!isSubmittingData && cancelDelete()} 
            color="secondary"
            disabled={isSubmittingData || isCountingTransaction}
          >
            Cancel
          </Button>        
        </DialogActions>
      </Dialog>
    );
  }

  export default DeleteSubCategoryDialog;