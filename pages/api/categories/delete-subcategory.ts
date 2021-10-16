import { NextApiRequest, NextApiResponse } from 'next'
import { deleteSubCategory } from '../../../lib/mongodb-access/categoriesApi'

const deleteASubCategory = async (req:NextApiRequest, res:NextApiResponse) => {
  const {categoryId, subCategoryId} = req.body;

  try {
    const deleteResult = await deleteSubCategory(categoryId, subCategoryId);  
    res.json(deleteResult);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
}

export default deleteASubCategory;