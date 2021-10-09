import { NextApiRequest, NextApiResponse } from 'next'
import { updateTransaction } from "../../../lib/transactionsApi" 

export default async function editTransaction(req:NextApiRequest, res:NextApiResponse) {
    const {transactionId, updatedTransaction, walletChange} = req.body;

    try {
        const updateResult = await updateTransaction(transactionId, updatedTransaction, walletChange);   
        res.json(updateResult);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}