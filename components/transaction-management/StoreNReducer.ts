import {getCurrentMonthName} from "../../lib/timeApi";
import { transactionFilterI, transactionFilterActionI, transactionSortI, transactionSortActionI } from "../../types";

export const transactionFilter:transactionFilterI = {
                                                        category:'0', 
                                                        subCategory:'0', 
                                                        dateFilter:{
                                                                        month:getCurrentMonthName(), 
                                                                        startDate:'', 
                                                                        endDate:''
                                                                    }
                                                    }
                                                   
export const transactionFilterReducer = (
                                            state:transactionFilterI, 
                                            action:transactionFilterActionI
                                        ):transactionFilterI => {  
    switch (action.type){
        case 'INITIALIZE':
            const {category, subCategory} = action;    
            return {...state, category, subCategory}  
        case 'RESET_FILTER':            
            return {...transactionFilter, dateFilter:{month:getCurrentMonthName(), startDate:'', endDate:''}};
        case 'SET_CATEGORY':      
            return {...state, category:action.category, subCategory:'0'}
        case 'SET_SUBCATEGORY':      
            return {...state, subCategory:action.subCategory}
        case 'SET_CATEGORY_SUBCATEGORY':      
            return {...state, category:action.category, subCategory:action.subCategory}
        case 'RESET_CATEGORY_SUBCATEGORY':     
            return {...state, category:'0', subCategory:'0'}
        case 'SET_MONTH':
            const {month} = action;      
            return {...state, dateFilter:{month, startDate:'', endDate:''}};
        case 'SET_DATE_RANGE':
            const {startDate, endDate} = action;
            return {...state, dateFilter:{month:'Date range', startDate, endDate}}
        default:
            return state;
    }
}

export const transactionSort:transactionSortI = {sortBy:'Amount', sortType:'asc'};

export const transactionSortReducer = (
                                        state:transactionSortI, 
                                        action:transactionSortActionI
                                      ):transactionSortI => {    
    switch (action.type) {
        case 'TOGGLE_SORT':
            const newSortBy = state.sortBy==='Date'?'Amount':'Date';
            return {sortBy:newSortBy, sortType:'asc'}      
        case 'TOGGLE_TYPE':
            const newSortType = state.sortType==='asc'?'desc':'asc'; 
            return {...state, sortType:newSortType}       
        default:
            return state;      
    }
};