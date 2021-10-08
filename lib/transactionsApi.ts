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
  
  try {
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
  }catch(err){
    return {message:err.toString()}
  }
                         
}

export const updateTransaction  = async (transactionId, updatedTransaction, walletBalance) => {
  const {amount, description, category, wallet, createdAt} = updatedTransaction;
  const {categoryId, subCategory:{subCategoryId}} = category;

  const { db } = await connectToDatabase();

  const updateObj:{
    amount:number,
    description:string,
    category:{
      categoryId:ObjectId,
      subCategory:{
        subCategoryId:ObjectId
      }
    },
    createdAt?:Date,
    updatedAt:Date
  } = {
    amount:amount, 
    description:description,
    category:{
                categoryId:new ObjectId(categoryId),
                subCategory:{
                  subCategoryId: new ObjectId(subCategoryId)
                }
              },
    updatedAt:new Date()
  }

  if(createdAt !== ""){
    updateObj.createdAt = new Date(createdAt);
  }

  try {
    const updateResult = await db
                        .collection("transactions")
                        .updateOne(
                          {_id:new ObjectId(transactionId)},
                          {
                            $set:updateObj
                          }
                        )

    if(updateResult.modifiedCount === 0){
      return {message:"No transaction has been updated!?"}
    }else {
      updateWalletBalance(walletBalance, wallet);
    }
  }catch(err){
    return {message:err.toString()}
  }
}

export const deleteTransaction  = async (transactionId, walletId, updatedWalletBalance) => {
  const { db } = await connectToDatabase();

  try {
    const deleteResult = await db
                        .collection("transactions")
                        .deleteOne({
                          _id: new ObjectId(transactionId)
                        })

    if(deleteResult.deletedCount !== 1){
      return {message:"error deleting transactions"}
    }else{
      updateWalletBalance(updatedWalletBalance, walletId);
    }
  }catch(err){
    return {message:err.toString()}
  }
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