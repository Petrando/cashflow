import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';
import { TransactionToDeleteTable } from './TransactionTable';
import { LoadingDiv } from '../globals/LoadingBackdrop';
import DialogSlide from '../globals/DialogSlide';
import { deleteTransaction } from '../../api/transactionApi';
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

    const submitDeleteData = (e) => {
        e.preventDefault();     

        const updatedWalletBalance = name === 'Expense'?
                                        walletBalance + amount
                                        :
                                        walletBalance - amount

        setIsSubmitting(true);
        deleteTransaction(walletId, _id, updatedWalletBalance)
            .then(data => {
                                if(typeof data === 'undefined'){
                                    console.log('Connection error?');
                                    setIsSubmitting(false);
                                    return;
                                }

                                if(data.error){
                                    console.log(data.error)
                                    setIsSubmitting(false);
                                }else{
                                    submitDelete(updatedWalletBalance);
                                }    		
            });
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
                'Submitting....'
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