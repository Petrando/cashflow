import { ObjectId } from "mongodb";
import { connectToDatabase } from "../mongodb";
import { newSubCategorySubmitI } from "../../types";

export const getCategories = async () => {
	const { db } = await connectToDatabase();
  
	const categories = await db
                    .collection("categories")
                    .find({})
                    .toArray();
  
	return categories;
}

export const intitialize = async (incomeSub:string, expenseSub:string) => {
  const { db } = await connectToDatabase();

  try {
    const initData  = await db
                      .collection("categories")
                      .insertMany( [
                        { name: "Income", subCategories:[{_id:new ObjectId(), name:incomeSub}] },
                        { name: "Expense", subCategories:[{_id:new ObjectId(), name:expenseSub}] }      		
                     ] );

    return initData;
  }catch (e) {
   		return e;
	}
}

export const addSubCategory = async (addData:{categoryId:string, subCategory:newSubCategorySubmitI}) => {
  const { db } = await connectToDatabase();
  
  const {categoryId, subCategory} = addData;
  const addSubResult = await db 
                       .collection("categories")
                       .updateOne(
                        { _id: new ObjectId(categoryId) },
                        {
                          $push: { subCategories:{_id:new ObjectId(), ...subCategory} },
                        }
                     )

  return addSubResult;
}

export const updateSubCategory = async (categoryId:string, subCategoryId:string, subCategory:string) => {
  const { db } = await connectToDatabase();

  const updateSubResult = await db 
                       .collection("categories")
                       .updateOne(
                        { _id: new ObjectId(categoryId) },
                        {
                          $set: { "subCategories.$[element].name":subCategory },
                        },
                        { 
                          arrayFilters: [ { "element._id": new ObjectId(subCategoryId) } ],
                          upsert: true 
                        }
                     )

  return updateSubResult;
}

export const deleteSubCategory = async (categoryId:string, subCategoryId:string) => {
  const { db } = await connectToDatabase();

  const deleteResult = await db
                      .collection("categories")
                      .updateOne(
                        { _id: new ObjectId(categoryId) },
                        { $pull: { subCategories: {_id: new ObjectId(subCategoryId)} }}
                      )

  return deleteResult;
}

export const getSubCategoryTransactionCount = async (categoryId:string, subCategoryId:string) => {
	const { db } = await connectToDatabase();
  
	const count = await db
                    .collection("transactions")
                    .find({
                            'category.categoryId':new ObjectId(categoryId), 
                            'category.subCategory.subCategoryId':new ObjectId(subCategoryId)
                          })
                    .count();
  
	return count;
}