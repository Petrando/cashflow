import { NextApiRequest, NextApiResponse } from 'next'
import { createTransaction } from "../../../lib/transactionsApi" 

export default async function addTransaction(req:NextApiRequest, res:NextApiResponse) {
    const {createParams} = req.body;

    try {
        const addResult = await createTransaction(createParams);   
        res.json(addResult);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}