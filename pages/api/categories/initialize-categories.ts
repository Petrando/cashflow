import { NextApiRequest, NextApiResponse } from 'next'
import { intitialize } from '../../../lib/mongodb-access/categoriesApi'

const initializeCategories = async (req:NextApiRequest, res:NextApiResponse) => {
  const {incomeSub, expenseSub} = req.body;

  try {
    const initResult = await intitialize(incomeSub, expenseSub);  
    res.json(initResult);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
}

export default initializeCategories;