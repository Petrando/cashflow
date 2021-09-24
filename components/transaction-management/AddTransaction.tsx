import {useState, useEffect} from 'react';
import {addNewTransaction} from "../../api/transactionApi"
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
        }  	
    }, []);
  
    const changeCategory = (newCategory:string) => {
        setSelectedCategory(newCategory);
        setSelectedSubCategory(categories.filter(d=>d._id===newCategory)[0].subCategories[0]._id);
        const isExpense = newCategory===categories[1]._id;//because the second category is for Expense...
        setIsExpense(isExpense);
        if(isExpense && (balance > walletBalance)) {
            setBalance(walletBalance);
        }
    }
  
    const submitTransaction = (e) => {
        e.preventDefault();  
        if(balance===0){
            cancelAdd();
            return;
        }
  
        setIsSubmitting(true);
        addNewTransaction(walletId, {balance, description, selectedCategory, selectedSubCategory, transactionIsExpense})
            .then(data=>{
                if(typeof data=== 'undefined'){
                    setIsSubmitting(false);
                    return;
                }
                if(data.error){
                    console.log(data.error)
                }else{
                    submitAdd(balance, transactionIsExpense);
                }
          })      
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
                            disabled={transactionIsExpense && walletBalance===0}
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
                    disabled={isSubmittingData}
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