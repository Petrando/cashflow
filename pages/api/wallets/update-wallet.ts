const fs = require('fs');
const formidable = require('formidable');
import { NextApiRequest, NextApiResponse } from 'next'
import { updateWallet } from "../../../lib/mongodb-access/walletApi"

export default async function updateWalletData(req:NextApiRequest, res:NextApiResponse) {
    try {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, async function (err, fields:{id:string, name:string, balance:string}, files:{icon:any}) {
        if (err) {

        } 

        const {id, name, balance} = fields;

        const updatedWalletData:{
                                  name?:string, 
                                  balance?:number, 
                                  updatedAt?:Date,
                                  icon?:{
                                          data?:any, 
                                          ['Content-Type']?:any
                                  }} = {}
        updatedWalletData.name = name;
        updatedWalletData.balance = parseInt(balance);
        updatedWalletData.updatedAt = new Date();
                
        if(files.icon){
          updatedWalletData.icon = {};
          updatedWalletData.icon.data = fs.readFileSync(files.icon.path);
          updatedWalletData.icon['Content-Type'] = files.icon.type;          
        }
      
        const updateResult = await updateWallet(id, updatedWalletData);                      
        res.json(updateResult);                
      });
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}

export const config = {
  api: {
    bodyParser: false,
  },
};