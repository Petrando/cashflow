import React, {useEffect, useReducer, useState} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import {AppBar, Paper, Tabs, Tab, Typography} from '@material-ui/core/';
import { rupiahFormatter } from '../util-functions';
import Layout from '../components/layout'
import WalletTransactions from '../components/transaction-management/WalletTransactions';
import WalletGraph from '../components/transaction-management/WalletGraph';
import getCurrentMonthName from '../api/currentMonthName';
import ShowAlert from '../components/globals/Alert';
import TabPanel, {a11yProps} from "../components/transaction-management/TransactionTab"
import { transactionFilter, transactionFilterReducer } from '../components/transaction-management/StoreNReducer';
import {useTransactionStyles} from "../styles/material-ui.styles";

export default function Transactions():JSX.Element {
  const router = useRouter();
  const classes = useTransactionStyles();
  const theme = useTheme();
  const [tabIdx, setTabIndex] = useState<number>(0);
  const [walletBalance, setBalance] = useState<number>(0);
  
  useEffect(()=>{
    setBalance(parseInt(router.query.balance.toString()));
  }, []);

  const [filter, dispatchFilter] = useReducer(transactionFilterReducer, transactionFilter);

  const handleChange = (event: React.ChangeEvent<{}>, newIdx: number) => {    
    dispatchFilter({type:'RESET_CATEGORY_SUBCATEGORY'});    
    if(newIdx===1){
      dispatchFilter({type:'SET_MONTH', month:getCurrentMonthName()});
    }
    setTabIndex(newIdx);
  };

  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const setCategoryNResetTab = (selectedCategory: string, selectedSubCategory: string) => {        
    dispatchFilter({type:'SET_CATEGORY_SUBCATEGORY', category:selectedCategory, subCategory:selectedSubCategory});
    setTabIndex(0);    
  }
  
  const {_id, name } = router.query;

  return (     
    <Layout>      
      <Head>
        <title>
          Wallet Transaction Details
        </title>
      </Head>
      <ShowAlert severity="warning" label={"ATTENTION : this page is still under development"} />
      <Paper className={classes.topPageTitle}>
        <Typography variant="h4" gutterBottom component="h4">
          {name}
        </Typography>
        <Typography variant="h5" gutterBottom component="h5">
          {rupiahFormatter(walletBalance)}
        </Typography>
      </Paper>
      <AppBar position="static" color="default">
        <Tabs
          value={tabIdx}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          centered
        >
          <Tab label="Transactions Table" {...a11yProps(0)} />
          <Tab label="Transactions Graph" {...a11yProps(1)} />          
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabIdx}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={tabIdx} index={0} dir={theme.direction}>         
          <WalletTransactions 
            filter={filter}
            dispatchFilter={dispatchFilter}
            _id={_id.toString()}
            name={name.toString()}
            walletBalance={walletBalance}
            setWalletBalance={(newBalance:number)=>{
                                                      setBalance(newBalance);
                                                    }}
          />
        </TabPanel>
        <TabPanel value={tabIdx} index={1} dir={theme.direction}>
          <WalletGraph 
            changeSelectedCategory={setCategoryNResetTab}
            filter={filter}
            dispatchFilter={dispatchFilter}
          />
        </TabPanel>        
      </SwipeableViews>
    </Layout>
  );
}