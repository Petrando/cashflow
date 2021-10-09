import { NextApiRequest, NextApiResponse } from 'next'
import { deleteTransaction } from "../../../lib/transactionsApi" 

export default async function removeTransaction(req:NextApiRequest, res:NextApiResponse) {
    const {transactionId, walletId, updatedWalletBalance} = req.body;

    try {
        const deleteResult = await deleteTransaction(transactionId, walletId, updatedWalletBalance);   
        res.json(deleteResult);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}