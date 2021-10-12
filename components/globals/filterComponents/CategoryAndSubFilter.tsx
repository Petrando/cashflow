import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { categoryAndSubFilterI, categoryFilterI, subCategoryFilterI } from "../../../types";
import { useTransactionStyles } from '../../../styles/material-ui.styles';
  
const CategoryAndSubFilter = (props:categoryAndSubFilterI):JSX.Element => {
    const classes = useTransactionStyles();
  
    const [categories, setCategories] = useState<categoryFilterI[]>([]);    
    const [subCategories, setSubCategories] = useState<subCategoryFilterI[]>([]); 
  
    useEffect(()=>{    
        if(props.categories.length > 0){
            initializeStates();
        }
    }, [props.transactionFilter]);
  
    const initializeStates = () => {
        const initCategories = [{_id:'0', name:'All'}].concat(props.categories.map(d => {return {_id:d._id, name:d.name};}));
        const {category} = props.transactionFilter;
        let initSubCategories:subCategoryFilterI[] = [{_id:'0', name:'All', category:''}];
        if(category!=="0"){      
            const selectedCategory = props.categories.filter(d=>d._id===category);
            if(selectedCategory.length > 0){
                initSubCategories = initSubCategories.concat(selectedCategory[0].subCategories);
            }
        }else{
            initSubCategories = initSubCategories                                                     
                .concat(props.categories[0].subCategories.map(d => {return {_id:d._id, name:d.name, category:'Income'}}))
                .concat(props.categories[1].subCategories.map(d => {return {_id:d._id, name:d.name, category:'Expense'}}));    
        }    
  
        setCategories(initCategories);
        setSubCategories(initSubCategories);                                                     
    }      
  
    const selectItem = ({_id, name}:categoryFilterI, i:number) => (
        <MenuItem key={_id} value={_id}>{name}</MenuItem>
    ) 
  
    const changeCategory = (e) => {
        const currentCategory = props.transactionFilter.category;
        const newCategory = e.target.value;
  
        const firstSubCategory:subCategoryFilterI = {_id:'0', name:'All'};
  
        if(newCategory==='0'){
            initializeStates();
        }
        else if(newCategory===props.categories[0]._id && currentCategory!==newCategory)//Income
        {
            setSubCategories([firstSubCategory].concat(props.categories[0].subCategories));
  
        }
        else if(newCategory===props.categories[1]._id && currentCategory!==newCategory)//Expense
        {
            setSubCategories([firstSubCategory].concat(props.categories[1].subCategories));      
        }
          
        props.dispatchFilter({type:'SET_CATEGORY', category:newCategory});    
    }
  
    const changeSubCategory = (e) => {
        const newSubCategory = e.target.value;
  
        const firstSubCategory:subCategoryFilterI = {_id:'0', name:'All'};
      
        if(props.transactionFilter.category==='0' && newSubCategory!=='0'){
            const selectedSubCategory = subCategories.filter(d=>d._id===newSubCategory)[0];
  
            const newCategory = selectedSubCategory.category;
  
            const newActiveCategory = props.categories[newCategory==='Income'?0:1];
            setSubCategories([firstSubCategory].concat(newActiveCategory.subCategories));                 
            props.dispatchFilter({type:'SET_CATEGORY_SUBCATEGORY', category:newActiveCategory._id, subCategory:e.target.value});
        }else{
            props.dispatchFilter({type:'SET_SUBCATEGORY', subCategory:e.target.value});
        }
        
    }
  
    return (
        <>
        <FormControl className={classes.formControl}>
            <InputLabel className={classes.formInput} id="category-label">Category</InputLabel>
            <Select
                className={classes.formInput}
                labelId="category-label"
                id="category-select"
                value={props.transactionFilter.category}          
                onChange={changeCategory}
            >
            {
                categories.length > 0 &&
                categories.map(selectItem)
            }    
            </Select>        
        </FormControl>
        <FormControl className={classes.formControl}>
            <InputLabel className={classes.formInput} id="sub-category-label">Sub Category</InputLabel>
            <Select
                className={classes.formInput}
                labelId="sub-category-label"
                id="sub-category-select"   
                value={props.transactionFilter.subCategory} 
                onChange={changeSubCategory}                            
            >
            {
                subCategories.length > 0 &&
                subCategories.map(selectItem)
            }
            </Select>        
        </FormControl>
        </>
    )
}

export default CategoryAndSubFilter;