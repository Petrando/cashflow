import {Dispatch} from 'react';
import { ObjectId } from 'mongodb';

export interface subCategoryI {
    _id?:string;
    name:string;
}

export interface subCategoryComponentI {
    subCategoryData:subCategoryI;
    startEdit:()=>void;
    submitEdit:(arg0:string, arg1:editSubCategorySubmitI)=>void;
    cancelEdit:()=>void;
    idSubEdited:string;
    startDelete:(arg0:string)=>void;
}

export interface categoryI {
    _id?:string;
    name:string;
    subCategories:subCategoryI[];
}

export interface newSubCategorySubmitI {
    name:string;
}

export interface newSubCategoryI {
    submitAdd:(arg0:newSubCategorySubmitI)=>void;
    cancelAdd:()=>void;
}

export interface editSubCategorySubmitI {
    newName:string;
}

export interface editSubCategoryI {
    subCategoryData:subCategoryI;
    submitEdit:(arg0:string, arg1:editSubCategorySubmitI)=>void;
    cancelEdit:()=>void;
}

export interface deleteSubCategoryI {
    cancelDelete:()=>void;
    deleteSub:()=>void;
    categoryId:string;
    categoryName:string;
    subToDelete:subCategoryI;
}

export interface transactionI {
    _id?:string;
    amount:number;
    description?:string;
    createdAt:string;
    updatedAt:string;
    wallet:string;
    category:{
        categoryId:string;
        name:string;
        subCategory:{
            subCategoryId:string;
            name:string;
        }
    };
}

export interface navLinkI {
    title:string;
    path:string;
    icon?:JSX.Element;
}

export interface walletI {
    _id?:string;
    name:string;
    icon?:string;
    balance:number;
}

export interface walletCardI {
    title:string;
    about:string;
    linkTo:string;
    avatar:JSX.Element;
}

export interface walletDisplayI {
    walletData:walletI;
    setEdit:()=>void;
    setDelete:()=>void;
    refresh:boolean;
}

export interface addWalletI {
    open:boolean;
    cancelAdd:()=>void;
    finishAndRefresh:()=>void;
}

export interface editWalletI {
    open:boolean;
    cancelEdit:()=>void;
    finishAndRefresh:()=>void;
    walletToEdit:walletI;    
    deleteInstead:()=>void;
}

export interface deleteWalletI {
    open:boolean;
    cancelDelete:()=>void;
    deleteAndRefresh:()=>void;
    walletToDelete:walletI;
    editInstead:()=>void;
}

export interface walletTransactionI {
    filter:transactionFilterI;
    dispatchFilter:Dispatch<transactionFilterActionI>;
    _id:string;
    name:string;
    walletBalance:number;
    setWalletBalance:(arg0:number)=>void;
}

export interface walletGraphI {
  filter:transactionFilterI;
  dispatchFilter:Dispatch<transactionFilterActionI>;
  changeSelectedCategory:(arg0:string, arg1:string)=>void;
}

export interface addTransactionI {
    submitAdd:(arg0:number, arg1:boolean)=>void;
    cancelAdd:()=>void;
    categories:categoryI[];
    walletId:string;
    walletBalance:number;
}

export interface editTransactionI {
    submitEdit:(args0:number)=>void;
    cancelEdit:()=>void;
    categories:categoryI[];
    walletId:string;
    walletBalance:number;
    editedTransaction:transactionI;
}

export interface deleteTransactionI {
    submitDelete:(arg0:number)=>void;
    editInstead:()=>void;
    cancelDelete:()=>void;
    transactionToDelete:transactionI;
    walletId:string;
    walletBalance:number;
}

interface dateFilterI {
    month:string;
    startDate:string;
    endDate:string;
}

export interface transactionFilterI {
    category:string;
    subCategory:string;
    dateFilter:dateFilterI
}

export interface transactionFilterActionI {
    type:string;
    category?:string;
    subCategory?:string;
    month?:string;
    startDate?:string;
    endDate?:string;
} 

export interface transactionSortI {
    sortBy:string;
    sortType:'asc' | 'desc';
}

export interface transactionSortActionI {
    type:string;
}

export interface transactionSortFilterComponentI{
    categories:categoryI[];
    sort:transactionSortI;
    dispatchSort:Dispatch<transactionSortActionI>;
    filter:transactionFilterI;
    dispatchFilter:Dispatch<transactionFilterActionI>;
}

export interface categoryAndSubFilterI {
    categories:categoryI[];
    transactionFilter:transactionFilterI;
    dispatchFilter:Dispatch<transactionFilterActionI>;
}

export interface categoryFilterI {
    _id:string;
    name:string;
}

export interface subCategoryFilterI {
    _id?:string;
    name:string;
    category?:string;
}

export interface transactionTimeFilterI {
    transactionFilter:transactionFilterI;
    dispatchFilter:Dispatch<transactionFilterActionI>;
}

export interface transactionTableI {
    tableData:transactionI[];
    setIdEdit:(arg0:string)=>void;
    setIdDelete:(arg0:string)=>void;
    sort:transactionSortI;
    dispatchSort:Dispatch<transactionSortActionI>;
}

export interface transactionTableHeaderI {
    sort:transactionSortI;
    dispatchSort:Dispatch<transactionSortActionI>;
    mySort:string;
}

export interface tablePagingI {
    handlePageChange:(arg0:number)=>void;
    page:number;
    count:number;
}

interface dataLayerI {
  _id:string;
  name:string;
  value:string;
}

export interface graphDataI {
  name:string;
  total:number;
  layers:dataLayerI[];
}

export interface showAlertI {
  severity:string;
  label:string;
  handleClose?:()=>void;
}

export interface transactionTabI {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

export interface fetchOptionsI {
  method:string;
  header?:any;
  body?:string;
}

export interface walletIconI {
  id:string;
  displayPic?:any;
  refresh?:boolean;
}

interface queryCategoryFilterI {
  categoryId?:ObjectId,
  subCategory?:{
    subCategoryId:ObjectId
  }
}

interface createdAtFilterI {
  $gte?:Date,
  $lte?:Date | number
}

export interface filterObjI {
  wallet:ObjectId,
  category?:queryCategoryFilterI,
  createdAt?:createdAtFilterI
}