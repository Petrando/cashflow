import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";

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