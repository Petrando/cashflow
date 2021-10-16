import { NextApiRequest, NextApiResponse } from 'next'
import { walletGraphData } from "../../../lib/mongodb-access/transactionsApi" 

export default async function getGraphData(req:NextApiRequest, res:NextApiResponse) {
    const {walletId, filterData} = req.body;

    try {
        const graphData = await walletGraphData(walletId, filterData);   
        res.json(graphData);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}