import React, {useState, useEffect, useReducer} from 'react';
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Add }  from '@material-ui/icons/';
import {getTransactionsByWallet, getFirstPageTransaction_and_category} from '../../api/transactionApi';
import LoadingBackdrop from '../globals/LoadingBackdrop';
import TransactionSortFilter from '../globals/filterComponents/TransactionSortFilter';
import TablePaging from '../globals/TablePaging';
import ShowAlert from '../globals/Alert';
import TransactionTable from './TransactionTable';
import { transactionSort, transactionSortReducer } from './StoreNReducer';
import AddTransactionDialog from './AddTransaction';
import EditTransactionDialog from './EditTransaction';
import DeleteTransactionDialog from './DeleteTransaction';
import { categoryI, transactionI, walletTransactionI } from '../../types';
import { useTransactionStyles } from "../../styles/material-ui.styles";

const itemPerPage = 5;

const WalletTransactions = ({
                              filter, 
                              dispatchFilter, 
                              _id, 
                              name, 
                              walletBalance, 
                              setWalletBalance
                            }:walletTransactionI):JSX.Element => {
	const classes = useTransactionStyles();

	const [categories, setCategories] = useState<categoryI[]>([]);
	const [transactions, setTransactions] = useState<transactionI[]>([]);
	const [firstLoaded, setFirstLoaded] = useState<boolean>(false);

	const [refreshMe, setRefresh] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAddTransaction, setIsAdd] = useState<boolean>(false);
	const [idToEdit, setIdEdit] = useState<string>('');
	const [idToDelete, setIdDelete] = useState<string>('');
	
	const [walletId, setWalletId] = useState<string>('');
	const [walletName, setWalletName] = useState<string>('');

	const [connectionError, setConnectionError] = useState<boolean>(false);
	const [paginationData, setPaginationData] = useState<{
															transactionCount:number, 
															currentPage:number, 
															maxPage:number
														}>
														({
														  	transactionCount:0, 
															currentPage:0,
															maxPage:0, 															
														});  

	const {transactionCount, currentPage} = paginationData;

  	const [sort, dispatchSort] = useReducer(transactionSortReducer, transactionSort);      

	useEffect(()=>{
    	if(typeof _id !== 'undefined'){
      		setWalletId(_id);
      		setWalletName(name);			
      		//setWalletBalance(balance);      
      		getFirstPage();
    	}		
	}, []);

  	const getFirstPage = () => {  
    	setIsLoading(true);
    	getFirstPageTransaction_and_category(_id, sort, filter)
      		.then(data => {
        		if(typeof data==='undefined'){
          			setConnectionError(true);
          			setIsLoading(false);
          			return;
        		}       
        		if(data.error){ 
              setConnectionError(true)        
        		}else{
          			const {category, transaction, count} = data; 
          			setCategories(category);
          			if(typeof category !== 'undefined' && category.length>  0){
            			setTransactions(setTransactionsCategoryName(transaction, category));
          			}         
          			setPaginationData({currentPage:0, transactionCount:count, maxPage:Math.ceil(count/itemPerPage)})
          			setFirstLoaded(true);
                setConnectionError(false);
        		}
        		setIsLoading(false);
      		});
	}
  
	useEffect(()=>{      
		if(refreshMe && firstLoaded){			      
			getNewPageData();
		}				
	}, [refreshMe]);

	useEffect(()=>{	
		if(firstLoaded)	{
			getNewPageData();	
		}		
	}, [currentPage]);

  useEffect(()=>{   
    if(firstLoaded){
      	setPaginationData({...paginationData, currentPage:0});
      	getNewPageData(true);
    }    
  }, [sort]);

  useEffect(()=>{   
    if(firstLoaded) {
      	getFirstPage();
    }    
  }, [filter]);
	
	const getNewPageData = (resetPage = false) => {
		setIsLoading(true);		
		if(walletId!==''){
			getTransactionsByWallet(walletId, !resetPage?currentPage:0, sort, filter)
				.then(data=>{
					if(typeof data === 'undefined'){
						setIsLoading(false);
            setRefresh(false);
            setConnectionError(true);
						return;
					}					
					if(data.error){							
            setConnectionError(true);					
					}else{						
						setTransactions(setTransactionsCategoryName(data));						
            setConnectionError(false);
					}
					setIsLoading(false);
          setRefresh(false);
				})
		}else {			
			setConnectionError(true);
			setRefresh(false);
		}
	}

	const setTransactionsCategoryName = (transactionData:transactionI[], categoryData = categories) => {
		if(typeof transactionData === 'undefined' || categoryData.length === 0){
			return [];
		}		

		transactionData.forEach((t:transactionI)=>{
			const {categoryId, subCategory} = t.category;
			const {subCategoryId} = subCategory;

			const myCategory = categoryData.filter(c=>c._id===categoryId)[0]
			const categoryName = typeof myCategory!=='undefined'?myCategory.name:'';
			const subCategoryName = typeof myCategory!=='undefined'?
                              myCategory.subCategories.filter(s=>s._id===subCategoryId)[0].name:'';

			t.category.name = categoryName;
			t.category.subCategory.name = subCategoryName;
		});

		return transactionData;
	}

	const submitAddAndRefresh = (balance:number, isExpense:boolean) => {
		if(currentPage!==0){
			setPaginationData({
								currentPage:0, 
								transactionCount:transactionCount + 1, 
								maxPage:Math.ceil(transactionCount + 1/itemPerPage)
							});
		}else{
			setPaginationData({...paginationData, transactionCount:transactionCount + 1});			
		}
		setWalletBalance(isExpense?walletBalance - balance
								   :
								   walletBalance + balance);
		setIsAdd(false);
		setRefresh(true);
	}	

	const submitEditAndRefresh = (updatedWalletBalance:number) => {
		setWalletBalance(updatedWalletBalance);
		setRefresh(true);
		setIdEdit('');
	}

	const submitDeleteAndRefresh = (updatedWalletBalance:number) => {				
		setPaginationData({
			currentPage:0,
			transactionCount:transactionCount-1,
			maxPage:Math.ceil(transactionCount + 1/itemPerPage)	
		})
		setWalletBalance(updatedWalletBalance);
		setIdDelete('');
		setRefresh(true);
	}	

	const handlePageChange = (newPage:number) => {
		setPaginationData({...paginationData, currentPage:newPage});		
	}

	return(
		<div className={classes.transactionsPage}>
      		{
        		isLoading && <LoadingBackdrop isLoading={isLoading} />
      		}       		   			
      		{
      			walletName!=="" &&
            !connectionError &&
      			<div className={classes.topButtonContainer}>      				
      				<Button variant="contained" color="primary" size="small" startIcon={<Add />}
      					onClick={()=>setIsAdd(true)}
      				>
      					New Transaction
      				</Button>      				
      			</div>
      		}      			
      		{
      			isAddTransaction &&
      			<AddTransactionDialog 
				  				submitAdd={submitAddAndRefresh} 
      							cancelAdd={()=>{setIsAdd(false)}} 
      							categories={categories} 
      							walletId={walletId} 
      							walletBalance={walletBalance} 
      			/>
      		}      
      		{
      			idToEdit!=="" &&
      			<EditTransactionDialog 
				  				submitEdit={submitEditAndRefresh}
      							cancelEdit={()=>{setIdEdit('')}}
      							categories={categories}
      							walletId={walletId}
      							walletBalance={walletBalance}
      							editedTransaction={transactions.filter(d=>d._id===idToEdit)[0]}
				/>      									   
      		} 			
      		{
      			idToDelete!=='' &&
      			<DeleteTransactionDialog 
				  				submitDelete={submitDeleteAndRefresh}
      							editInstead={()=>{
      										 	const newEdit = idToDelete;
      										 	setIdEdit(newEdit);
      										 	setIdDelete('')
      										 }}
      							cancelDelete={()=>{setIdDelete('')}}
      							transactionToDelete={transactions.filter(d=>d._id===idToDelete)[0]}      										       										 
      							walletId={walletId} 
								walletBalance={walletBalance}
      			/>
      		}  
            {
              	categories.length > 0 &&              
              	<TransactionSortFilter 
                	categories={categories}
                	sort={sort} 
                	dispatchSort={dispatchSort}
                	filter={filter}
                	dispatchFilter={dispatchFilter}
              	/>
            }      			
            {
              	firstLoaded &&
              	transactions.length === 0 &&              
              	<Typography variant="body1" gutterBottom>
                	No transaction yet...
              	</Typography>
            } 
            {
              	transactions.length > 0 &&
              	<>                
                	<TablePaging 
                       	handlePageChange={handlePageChange} 
                       	page={currentPage} 
                       	count={transactionCount}
                	/> 
                	<TransactionTable 
                        tableData={transactions} 
                        setIdEdit={setIdEdit}
                        setIdDelete={setIdDelete}
                        sort={sort} 
                        dispatchSort={dispatchSort}
                	/>
              	</>
            }
            {
              connectionError && 
              <ShowAlert severity="warning" label={"WARNING: check your connection"} />
            }             
      	</div>
	)
}    			

export default WalletTransactions;