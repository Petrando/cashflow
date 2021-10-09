import { NextApiRequest, NextApiResponse } from 'next'
import { updateTransaction } from "../../../lib/transactionsApi" 

export default async function editTransaction(req:NextApiRequest, res:NextApiResponse) {
    const {transactionId, updatedTransaction, walletBalance} = req.body;

    try {
        const addResult = await updateTransaction(transactionId, updatedTransaction, walletBalance);   
        res.json(addResult);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}