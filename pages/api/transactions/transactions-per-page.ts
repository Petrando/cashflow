import { NextApiRequest, NextApiResponse } from 'next'
import { transactionsPerPage } from "../../../lib/transactionsApi" 

export default async function pageTransactions(req:NextApiRequest, res:NextApiResponse) {    
    const {filterData, sortData, walletId, currentPage} = req.body;

    try {
        const transactions = await transactionsPerPage(walletId, currentPage, filterData, sortData);  
        res.json(transactions);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}
