import { NextApiRequest, NextApiResponse } from 'next'
import {deleteWallet} from "../../../lib/walletApi";

async function removeWallet(req:NextApiRequest, res:NextApiResponse) {
    const {walletId} = req.body;
    try {               
        const deleteResult = await deleteWallet(walletId);            
        
        res.json(deleteResult);                
                
    } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
    }      
}

export default removeWallet;