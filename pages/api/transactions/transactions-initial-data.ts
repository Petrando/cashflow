import { NextApiRequest, NextApiResponse } from 'next'
import { getWalletTransactions_and_categories } from "../../../lib/mongodb-access/transactionsApi" 

export default async function transactionsAndCategories(req:NextApiRequest, res:NextApiResponse) {
    const {filterData, sortData, walletId} = req.body;

    try {
        const transactions = await getWalletTransactions_and_categories(walletId, filterData, sortData);   
        res.json(transactions);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}