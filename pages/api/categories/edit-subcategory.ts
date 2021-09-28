import { NextApiRequest, NextApiResponse } from 'next'
import { updateSubCategory } from '../../../lib/categoriesApi'

const editSubCategory = async (req:NextApiRequest, res:NextApiResponse) => {
  const {categoryId, subCategoryId, subCategory} = req.body;

  try {
    const editResult = await updateSubCategory(categoryId, subCategoryId, subCategory);  
    res.json(editResult);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
}

export default editSubCategory;