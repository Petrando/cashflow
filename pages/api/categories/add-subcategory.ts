import { NextApiRequest, NextApiResponse } from 'next'
import { addSubCategory } from '../../../lib/mongodb-access/categoriesApi'

const addNewSubCategory = async (req:NextApiRequest, res:NextApiResponse) => {
  //const {categoryId, subCategory} = JSON.parse(req.body);
  //categoryId, subCategory
  try {
    const addResult = await addSubCategory(req.body);  
    res.json(addResult);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
}

export default addNewSubCategory;