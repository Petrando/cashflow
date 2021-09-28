import { useState, useEffect } from 'react';
import fetchJson from '../../lib/fetchJson';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import { LoadingDiv } from "../globals/LoadingBackdrop";
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
        getTransactionCount();
    }, []);

    const getTransactionCount = async () => {
        try {
          const transactionCount = await fetchJson("/api/categories/count-subcategory-transaction", {
            method: "POST",            
            headers: {
              Accept: 'application/json',
              "Content-Type": "application/json"
            },
            body: JSON.stringify({categoryId, subCategoryId:_id})
          });
                  
          setTransactionCount(transactionCount);
          setIsCountingTransaction(false);
        
        } catch (error) {
          console.error("An unexpected error happened:", error);
        }
    }
  
    return (
      <Dialog fullWidth={true} maxWidth={'sm'}
        onClose={()=>{}} aria-labelledby="simple-dialog-title" open={true}>
        <DialogTitle id="simple-dialog-title">
          {
            isSubmittingData?"Deleting....":
            isCountingTransaction?'Counting transactions....':
                                  transactionCount===0?'Delete this sub category?':
                                                       'There are transaction(s)'}        
        </DialogTitle>
        <DialogContent>
          {
            (isCountingTransaction || isSubmittingData) && <LoadingDiv />
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
              onClick={()=>{
                setIsSubmitting(true);
                deleteSub();
              }} 
              color="primary"  
              disabled={isSubmittingData || isCountingTransaction}        
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