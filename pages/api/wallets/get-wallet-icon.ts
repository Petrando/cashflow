import { NextApiRequest, NextApiResponse } from 'next'
import { getWalletIcon } from "../../../lib/walletApi" 

export default async function walletIcon(req:NextApiRequest, res:NextApiResponse) {      
    const {walletId} = req.body;
    
    try {
        const walletIcon = await getWalletIcon(walletId);
        
        res.json(walletIcon[0].icon);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}