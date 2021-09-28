import { NextApiRequest, NextApiResponse } from 'next'
import { getWalletIcon } from "../../../lib/walletApi" 

export default async function walletIcon(req:NextApiRequest, res:NextApiResponse) {  
    console.log('getting icon....');
  
    const {walletId} = req.body;

    console.log(walletId);
    
    try {
        const walletWithIcon = await getWalletIcon(walletId);                  

        const myIcon = {
          data:walletWithIcon[0].icon.data, 
          ["Content-Type"]:walletWithIcon[0].icon.contentType
        }

        res.json(myIcon);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}