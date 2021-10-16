import { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router'
import { getTransactionCount } from "../../../lib/mongodb-access/transactionsApi" 

export default async function transactionsAndCategories(req:NextApiRequest, res:NextApiResponse) {
    const router = useRouter();
    const {walletId} = router.query;
    const {filterData} = req.body;

    try {
        const transactions = await getTransactionCount(walletId, filterData);  
        res.json(transactions);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}