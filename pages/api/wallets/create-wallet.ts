const fs = require('fs');
const formidable = require('formidable');
import { NextApiRequest, NextApiResponse } from 'next'
import {addAWallet} from "../../../lib/walletApi";

async function createWallet(req:NextApiRequest, res:NextApiResponse) {
    try {
        const form = new formidable.IncomingForm({ keepExtensions: true });
        form.parse(req, async function (err, fields:{name:string, balance:string}, files:{icon:any}) {
          if (err) {

          } 
          
          const {name, balance} = fields;

          const newSavingData:{
                                name?:string, 
                                balance?:number, 
                                createdAt?:Date, 
                                updatedAt?:Date,
                                icon?:{data?:any, ['Content-Type']?:any}
                              } = {}
          newSavingData.name = name;
          newSavingData.balance = parseInt(balance); 
          newSavingData.createdAt = new Date();
          newSavingData.updatedAt = new Date();
          
          newSavingData.icon = {};
          newSavingData.icon.data = fs.readFileSync(files.icon.path);
          newSavingData.icon['Content-Type'] = files.icon.type;         
          const addResult = await addAWallet(newSavingData);  
          const  {insertedId} = addResult;
        
          res.json({message:insertedId && (insertedId!=="" || insertedId!==null)?"success":"not added"});                
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

export default createWallet;

function photoDimension(photoDimension: any): { width: any; height: any; } {
  throw new Error('Function not implemented.');
}
