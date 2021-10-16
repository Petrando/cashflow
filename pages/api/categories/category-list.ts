import { NextApiRequest, NextApiResponse } from 'next'
import { getCategories } from "../../../lib/mongodb-access/categoriesApi" 

export default async function savingList(req:NextApiRequest, res:NextApiResponse) {
    
    //const projection = req.body === "" ?{}:JSON.parse(req.body).projection;
    try {
        const categories = await getCategories();  
        res.json(categories);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
}