import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';
import { TransactionToDeleteTable } from './TransactionTable';
import { LoadingDiv } from '../globals/LoadingBackdrop';
import DialogSlide from '../globals/DialogSlide';
import fetchJson from '../../lib/fetchJson';
import { deleteTransactionI } from '../../types';

export default function DeleteTransactionDialog({
    submitDelete, 
    editInstead, 
    cancelDelete, 
    transactionToDelete:{
        _id,
        amount, 
        description, 
        category:{
            name,
            subCategory
        }
    },
    walletId, walletBalance}:deleteTransactionI) 
{      
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [allowDelete, setAllowDelete] = useState<boolean>(true);

    useEffect(()=>{  	
        if(name==='Income' && (walletBalance < amount)){  		
            setAllowDelete(false);
        }
    }, []);

    const submitDeleteData = async (e) => {
        e.preventDefault();     

        const walletChange = name === "Expense"?amount:-Math.abs(amount);
        const updatedWalletBalance = walletBalance + walletChange;

        setIsSubmitting(true);

        try {
            const deleteResult = await fetchJson("/api/transactions/delete-transaction", {
                method: "POST",            
                headers: {
                  Accept: 'application/json',
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({transactionId:_id, walletId, walletChange})
            });          
            const {acknowledged, modifiedCount } = deleteResult; 
            if(acknowledged && modifiedCount === 1){
                submitDelete(updatedWalletBalance); 
            }
            else{
                throw new Error("Delete transaction failed");
            }
             
        } catch (error) {
              console.error("An unexpected error happened:", error);
              
        } finally {
              setIsSubmitting(false)
        }
    }

    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>!isSubmittingData && cancelDelete()} 
            aria-labelledby="delete-dialog-title" 
            open={true}
            TransitionComponent={DialogSlide}
        >
            <DialogTitle id="delete-dialog-title">
            {
                isSubmittingData?
                'Deleting....'
                :
                allowDelete?'Delete this transaction?':'Cannot delete transaction (wallet must not negative)'
            }
            </DialogTitle>
            <DialogContent>  
            {
                !isSubmittingData &&
                <>
                <Typography variant="subtitle1" gutterBottom>
                    {name} - {subCategory.name}          	
                </Typography>
                <TransactionToDeleteTable
                    walletBalance={walletBalance}
                    amount={amount}
                    transactionIsExpense={name==='Expense'}
                />
                </> 
            }
            {
                isSubmittingData &&
                <LoadingDiv />
            }     	   
            </DialogContent>
                <DialogActions>      	
                    <Button 
                        color="primary" 
                        disabled={isSubmittingData}
                        onClick={allowDelete?submitDeleteData:editInstead}
                    >
                    {allowDelete?'Delete':'Edit instead?'}
                    </Button>
                    <Button 
                        color="secondary" 
                        disabled={isSubmittingData}
                        onClick={()=>{!isSubmittingData && cancelDelete()}}
                    >
                        Cancel
                    </Button>        
                </DialogActions>
            </Dialog>
    );
}