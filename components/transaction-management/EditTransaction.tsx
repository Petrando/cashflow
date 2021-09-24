import {useState, useEffect} from 'react';
import {updateTransaction} from "../../api/transactionApi"
import { 
            Button, 
            Dialog, 
            DialogTitle, 
            DialogContent, 
            DialogActions, 
            FormControl, 
            FormLabel,
            Paper, 
            TextField, 
            Typography 
       } from '@material-ui/core';
import SelectControl from '../globals/SelectControl';
import Date from '../globals/date';
import { DatePickersB } from '../globals/DatePickers';
import { LoadingDiv } from '../globals/LoadingBackdrop';
import { rupiahFormatter } from '../../util-functions';
import { editTransactionI } from '../../types';
import { useTransactionStyles } from "../../styles/material-ui.styles";

export default function EditTransactionDialog({
                                                submitEdit, 
                                                cancelEdit, 
                                                categories, 
                                                walletId, 
                                                walletBalance, 
                                                editedTransaction
                                            }:editTransactionI):JSX.Element {      
    const transactionClasses = useTransactionStyles();
    
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [limitBalance, setLimitBalance] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [transactionIsExpense, setIsExpense] = useState<boolean>(false);
    const [newDate, setNewDate] = useState<string>('');
  
    const [editDirty, setEditDirty] = useState<boolean>(false);
  
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
  
    useEffect(()=>{    	
        initializeData();
  
        let itIsExpense = categories[0]._id !== editedTransaction.category.categoryId;
        setIsExpense(itIsExpense);
        if(!itIsExpense){
            if(walletBalance >= editedTransaction.amount){
                setLimitBalance(1);
            }else{
                setLimitBalance(editedTransaction.amount - walletBalance)
            }
        }else{
            setLimitBalance((editedTransaction.amount + walletBalance))
        }
    }, []);
  
    const initializeData = () => {  	
        const {amount, category, description, createdAt} = editedTransaction;
        const {categoryId, subCategory} = category;
        const {subCategoryId} = subCategory;
  
        setSelectedSubCategory(subCategoryId);
        setSelectedCategory(categoryId);
        setBalance(amount);
        setDescription(description);
        setNewDate('');
            
        setEditDirty(false);
    }
  
    const submitData = (e) => {
        e.preventDefault();       
        if(!editDirty){
            cancelEdit();
        }
      
        const balanceChange = balance - editedTransaction.amount;
  
        const updatedWalletBalance = transactionIsExpense?  walletBalance - balanceChange
                                                            :
                                                            walletBalance + balanceChange;
  
        const updatedTransaction = {
            amount:balance,
            description,
            category:{categoryId:selectedCategory, subCategory:{subCategoryId:selectedSubCategory}},
            wallet: walletId,
            createdAt: ''
        }   
  
        if(newDate!==''){
            updatedTransaction.createdAt = newDate;
        }
  
        const transactionId = editedTransaction._id;	
  
        setIsSubmitting(true);
        updateTransaction(walletId, transactionId, updatedWalletBalance, updatedTransaction)
            .then(data=>{
                if(typeof data==='undefined'){
                    console.log('Connection error?!');
                    setIsSubmitting(false);
                    return;
                }
  
                if(data.error){
                    console.log(data.error);
                }else{
                    submitEdit(updatedWalletBalance)
                }
        }); 
    } 
  
    const balanceAdjusting = ():boolean => {
        let adjustedBalance = balance;  	
        if(transactionIsExpense){
            if(adjustedBalance > limitBalance){
                adjustedBalance=limitBalance;
            }
        }else{                
            if(adjustedBalance < limitBalance){
                adjustedBalance = limitBalance;
            }
        }    
      
        let adjusted = balance!==adjustedBalance;
  
        if(adjusted){
            setBalance(adjustedBalance);
            setEditDirty(true);   
            console.log(adjusted);
        }
        return adjusted;  
    }
  
    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>!isSubmittingData && cancelEdit()} 
            aria-labelledby="edit-dialog-title" 
            open={true}
        >
            <DialogTitle id="edit-dialog-title">
                {isSubmittingData?'Submitting Edit....':'Edit Transaction'}        
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
                        onChange={()=>{}}
                        disabled={true}
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
                        onChange={(newSub)=>{setSelectedSubCategory(newSub);setEditDirty(true);}}
                    />      	  
                </div>
                <TextField          	          
                    margin="dense"          	
                    label={
                            transactionIsExpense?
                            `Spending amount (max ${rupiahFormatter(limitBalance)})`
                            :
                            `Income amount (minimum ${rupiahFormatter(limitBalance)})`
                          }
                    type="number"          	
                    fullWidth
                    value={balance}
                    onChange={(e)=>{
                                        const {value} = e.target;
                                        const parsedValue = parseInt(value);
                                        const formattedValue = (isNaN(parsedValue) || parsedValue < 1)?1:parsedValue;              
                                        setBalance(formattedValue);
                                        setEditDirty(true);
                             }}
                    onBlur={()=>{balanceAdjusting();}}
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
                    onChange={(e)=>{setDescription(e.target.value);setEditDirty(true);}}
                    disabled={isSubmittingData}
                />
                <div className={transactionClasses.selectContainer}>
                    <Paper>
                        <Typography variant="subtitle1">
                            Date created : <Date dateString={editedTransaction.createdAt} />
                        </Typography>
                    </Paper>            
                    <FormControl className={transactionClasses.drawerControl} component="fieldset">
                    {
                        newDate!=='' &&
                        <FormLabel component="legend">New date: {newDate}</FormLabel>
                    }                
                    <DatePickersB 
                        id={"new-date"} 
                        label={"New date"} 
                        myDate={newDate} 
                        changeDate={(e)=>{ 
                                            setNewDate(e.target.value);
                                            setEditDirty(true);
                                    }} 
                    />
                    </FormControl>                           
                </div>
            </>
            }            
            {
                isSubmittingData && <LoadingDiv />
            }
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitData} 
                    color="primary" 
                    disabled={isSubmittingData}         
                >
                    Submit
                </Button>
                <Button 
                    onClick={initializeData} 
                    color="primary"
                    disabled={!editDirty || isSubmittingData}
                >
                    Reset
                </Button>
                <Button 
                    onClick={()=>!isSubmittingData && cancelEdit()} 
                    color="secondary"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button>        
            </DialogActions>
        </Dialog>
    );
  }