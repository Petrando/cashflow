import {useState, useEffect} from 'react';
import fetchJson from '../../lib/fetchJson';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import SelectControl from '../globals/SelectControl';
import { LoadingDiv } from '../globals/LoadingBackdrop';
import { rupiahFormatter } from '../../util-functions';
import { addTransactionI } from '../../types';
import { useTransactionStyles } from "../../styles/material-ui.styles";

export default function AddTransactionDialog({
                                                submitAdd, 
                                                cancelAdd, 
                                                categories, 
                                                walletId, 
                                                walletBalance
                                            }:addTransactionI):JSX.Element {  
    const transactionClasses = useTransactionStyles();
  
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [transactionIsExpense, setIsExpense] = useState<boolean>(false);
  
    useEffect(()=>{  	
        if(typeof categories[0] !== 'undefined'){
            setSelectedCategory(categories[0]._id);
            setSelectedSubCategory(categories[0].subCategories[0]._id);
            toggleIsExpense(categories[0]._id);
        }  	
    }, []);
  
    const changeCategory = (newCategory:string) => {
        setSelectedCategory(newCategory);
        setSelectedSubCategory(categories.filter(d=>d._id===newCategory)[0].subCategories[0]._id);
        toggleIsExpense(newCategory);        
    }

    const toggleIsExpense = (newCategory:string) => {
        const isExpense = categories.filter(d => d._id === newCategory)[0].name === "Expense";
        setIsExpense(isExpense);
      
        if(isExpense && (balance > walletBalance)) {
          setBalance(walletBalance);
        }
    }
  
    const submitTransaction = async (e) => {
        e.preventDefault();  
        if(balance<=0){
            cancelAdd();
            return;
        }
  
        setIsSubmitting(true);
          
        const createParams =  {
            balance, description, selectedCategory, selectedSubCategory, transactionIsExpense, 
            walletToUpdateId:walletId
        }

        try {
            const addResult = await fetchJson("/api/transactions/add-transaction", {
              method: "POST",            
              headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
              },
              body: JSON.stringify({createParams})
            });          
            const {acknowledged, modifiedCount } = addResult; 
            if(acknowledged && modifiedCount === 1){
              submitAdd(balance, transactionIsExpense); 
            }
            else{
              throw new Error("Add transaction failed");
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
            onClose={()=>!isSubmittingData && cancelAdd()} 
            aria-labelledby="add-dialog-title" 
            open={true}
        >
            <DialogTitle id="add-dialog-title">
                {!isSubmittingData?'New Transaction':'Submitting  new transaction...'}
            </DialogTitle>
            <DialogContent>        
                {
                    !isSubmittingData &&
                    <>          
                    <div className={transactionClasses.selectContainer}>          
                        <SelectControl 
                            labelId={"category-select-label"} 
                            label={"Category"} 
                            selectId={"select-category"} 
                            selectItems={categories}
                            value={selectedCategory}
                            onChange={changeCategory}
                        />
                        <SelectControl 
                            labelId={"subcategory-select-label"} 
                            label={"Sub Category"} 
                            selectId={"select-subcategory"} 
                            selectItems={
                                            typeof categories.filter(d=>d._id===selectedCategory)[0]!=='undefined'?
                                            categories.filter(d=>d._id===selectedCategory)[0].subCategories
                                            :
                                            []
                                        }
                            value={selectedSubCategory}
                            onChange={(newSub:string)=>{setSelectedSubCategory(newSub)}}
                        />      	  
                    </div>
                    <TextField
                        autoFocus          	
                        margin="dense"          	
                        label={
                                transactionIsExpense?
                                `Spending amount (max ${rupiahFormatter(walletBalance)})`
                                :
                                "Income amount"
                              }
                        type="number"          	
                        fullWidth
                        value={balance}
                        onChange={(e)=>{
                                            const {value} = e.target;
                                            const newValue = parseInt(value);
                                            let newBalance = (isNaN(newValue) || newValue < 0)?0:newValue;
                                            if(transactionIsExpense && (newBalance > walletBalance)){
                                                newBalance = walletBalance;
                                            } 
                                            setBalance(newBalance);
                                }}
                        disabled={isSubmittingData}
                    />
                    <TextField          	          
                        margin="dense"          	
                        label="About"
                        type="text"          	
                        multiline
                        rowsMax={4}
                        fullWidth
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        disabled={isSubmittingData}
                    />
                    </>
                }
                {
                    isSubmittingData && <LoadingDiv />
                }
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitTransaction} 
                    color="primary"          
                    disabled={isSubmittingData || (transactionIsExpense && walletBalance===0)}
                >
                    Submit
                </Button>
                <Button onClick={()=>!isSubmittingData && cancelAdd()} color="secondary"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button>        
            </DialogActions>
      </Dialog>
    );
  }