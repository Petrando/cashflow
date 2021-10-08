import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";
import {getFirstDayOfMonth, getLastDayOfMonth, createMaxIsoString} from "./timeApi"
import { errorHandler } from "./errorHandler";

const itemPerPage = 5;

interface categoryFilterI {
  categoryId?:ObjectId,
  subCategory?:{
    subCategoryId:ObjectId
  }
}

interface createdAtFilterI {
  $gte?:Date,
  $lte?:Date | number
}

interface filterObjI {
  wallet:ObjectId,
  category?:categoryFilterI,
  createdAt?:createdAtFilterI
}

function createFilter(filterData, walletId){	
	const {category, subCategory, dateFilter} = filterData;
	if(typeof dateFilter==='undefined'){
		return {}
	}
		
	const {month, startDate, endDate} = dateFilter;

	const filterObj:filterObjI = {wallet:new ObjectId(walletId)}	

	if(category!=='0'){
		filterObj['category.categoryId'] = new ObjectId(category);
		if(subCategory!=='0'){
			filterObj['category.subCategory.subCategoryId'] = new ObjectId(subCategory);
		}
	}
	
	if(month!=='All'){
		if(month!=='Date range'){
			const firstDay = getFirstDayOfMonth(month).toISOString();				
      const lastDay = getLastDayOfMonth(month).toISOString();

			filterObj.createdAt = {$gte:new Date(firstDay), $lte:new Date(lastDay)}	
		}else{
			const firstDay = new Date(`${startDate}`).toISOString();	
			const lastDay = new Date(`${createMaxIsoString(endDate)}`).toISOString();			

			filterObj.createdAt = {$gte:new Date(firstDay), $lte:new Date(lastDay)}	
		}
	}

	return filterObj;	
}

function createSort(sort){
	const {sortBy, sortType} = sort;	
	let sortObj:{
    createdAt?:any,
    amount?:any
  } = {};

	if(sortBy==='Date'){
		sortObj.createdAt = sortType;
	}else if(sortBy==='Amount'){
		sortObj.amount = sortType;
	}
	return sortObj;
}

export const getWalletTransactions_and_categories = async (walletId, filterData, sortData) => {	

	const filterObj = createFilter(filterData, walletId);
	const sort = createSort(sortData);
  console.log(filterObj)
  
  const { db } = await connectToDatabase();

	const transactionCount = await db
                  .collection("transactions")
                  .find(filterObj)
                  .count();

  const categoryData = await db
                  .collection("categories")
                  .find({})
                  .toArray();

  const transactionData = await db  
                  .collection("transactions")
                  .find(filterObj)
                  .sort(sort)
                  .limit(itemPerPage)
                  .toArray();

  return{category:categoryData, transaction:transactionData, count:transactionCount}
};

export const getTransactionCount = async (walletId, filterData) => {
  const filterObj = createFilter(filterData, walletId);

  const { db } = await connectToDatabase();

	const transactionCount = await db
                  .collection("transactions")
                  .find(filterObj)
                  .count();

  return transactionCount;  
}

export const transactionsPerPage = async (walletId, currentPage, filterData, sortData) =>
{	  
	const filterObj = createFilter(filterData, walletId)
	const sort = createSort(sortData);	

  const { db } = await connectToDatabase();

  const transactionData = await db  
                            .collection("transactions")
                            .find(filterObj)
                            .sort(sort)
	                          .skip(currentPage * itemPerPage)
	                          .limit(itemPerPage)
                            .toArray();

  return transactionData;
}

export const createTransaction  = async (balance, description, selectedCategory, selectedSubCategory, transactionIsExpense, walletToUpdateId) => {
  const { db } = await connectToDatabase();

  const today = new Date();
  
  const createResult = await db  
                        .collection("transactions")
                        .insertOne({
                          amount: balance, 
		                      description, 
		                      category:{
			                      categoryId:new ObjectId(selectedCategory),
			                      subCategory:{
				                      subCategoryId: new ObjectId(selectedSubCategory)
			                      }		
		                      },
		                      wallet: new ObjectId(walletToUpdateId),
                          createdAt: today,
                          updatedAt: today
                        });
  if(!createResult.acknowledged || !createResult.insertedId || createResult.insertedId === null){
    return {message:"error while creating transaction"}
  }else {
    updateWalletBalance(transactionIsExpense?-balance:balance, walletToUpdateId);
  }                        
}

export const updateTransaction  = async () => {
  
}

export const deleteTransaction  = async () => {
  
}

const updateWalletBalance = async (balance, walletId) => {
  const { db } = await connectToDatabase();

  const updateWalletResult = await db
                                .collection("wallets")
                                .updateOne(
                                  {_id:new ObjectId(walletId)},
                                  {
                                    $inc:{amount:balance}
                                  }
                                )

    return updateWalletResult;
}