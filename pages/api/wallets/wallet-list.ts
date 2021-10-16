import { NextApiRequest, NextApiResponse } from 'next'
import { getWallets } from "../../../lib/mongodb-access/walletApi" 

export default async function walletList(req:NextApiRequest, res:NextApiResponse) {
    try {
        const wallets = await getWallets(false);  
        res.json(wallets);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}