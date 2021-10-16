import { NextApiRequest, NextApiResponse } from 'next'
import { getSubCategoryTransactionCount } from '../../../lib/mongodb-access/categoriesApi'

const countTransaction = async (req:NextApiRequest, res:NextApiResponse) => {
  const {categoryId, subCategoryId} = req.body;

  try {
    const count = await getSubCategoryTransactionCount(categoryId, subCategoryId);  
    res.json(count);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
}

export default countTransaction;