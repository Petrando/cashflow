import { ObjectId } from "mongodb";
import { connectToDatabase } from "../mongodb";

export const getWallets = async (withPhoto:boolean) => {
	const { db } = await connectToDatabase();
  
	const wallets = !withPhoto?
		await db
	  		.collection("wallets")
	  		.find({})
			  .project({ icon:0})
	  		.toArray()
		:
		await db
	  		.collection("wallets")
	  		.find({})
	  		.toArray();
  
	return wallets;
}

export const getWalletIcon = async (walletId:string) => {
  const { db } = await connectToDatabase();

  const walletIcon = 
    await db
        .collection("wallets")
        .find({_id:new ObjectId(walletId)})
        .project({_id:0, icon:1})
        .toArray();

  return walletIcon;
}

export const addAWallet = async (newWalletData) => {
	const { db } = await connectToDatabase();

	const newWallet = await db
		.collection("wallets")
		.insertOne( { ...newWalletData} );

	return newWallet;
}

export const updateWallet = async (id, updateData) => {
	const { db } = await connectToDatabase();
  
	const updatedWallet = await db
	  .collection("wallets")
	  .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { ...updateData },
        }
     )
	return updatedWallet;
}

export const deleteWallet = async (walletId) => {
	const { db } = await connectToDatabase();
	const deletedWallet = await db
	  .collection("wallets")
	  .deleteOne(
        { _id: new ObjectId(walletId) }
     )
  
	return deletedWallet;
}
