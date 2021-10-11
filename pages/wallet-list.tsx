import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import useSWR from 'swr';
import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import { AccountBalanceWallet, Add } from '@material-ui/icons';
import Layout from '../components/layout'
import { getWallets } from '../api/walletApi';
import Wallet from '../components/wallets-management/Wallet';
import AddWalletDialog from '../components/wallets-management/AddWallet';
import EditWalletDialog from '../components/wallets-management/EditWallet';
import DeleteWalletDialog from '../components/wallets-management/DeleteWallet';
import LoadingBackdrop from '../components/globals/LoadingBackdrop';
import ShowAlert from '../components/globals/Alert';
import fetcher from '../lib/fetcher';
import { walletI } from '../types'; 
import { useWalletStyles } from '../styles/material-ui.styles';

export default function WalletList() {
  const classes = useWalletStyles();

  const {data:walletData, mutate, error:walletFetchErr} = useSWR('/api/wallets/wallet-list', fetcher);
  const [refreshMe, setRefresh] = useState<boolean>(false);
  const [addingWallet, setAddingWallet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [idEdited, setIdEdit] = useState<string>('');
  const [idToDelete, setIdToDelete] = useState<string>('');

  const [error, setError] = useState<string>("");

  useEffect(()=>{
      walletData && isLoading && setIsLoading(false);
      if(refreshMe){
        setRefresh(false);
      }
  }, [walletData, walletFetchErr]);

  useEffect(()=>{    
    if(refreshMe){
      mutate();
    }
  }, [refreshMe]);
  /*
  useEffect(() => {
    if(refreshMe){   
      setIsLoading(true);   
      getWallets()
        .then(data => {
          if(typeof data==='undefined'){     
            setError("No data, please check your connection");               
            return;          
          }
          if(data.error){                    
            setError("Please check your connection")
          } else {
            setWallets(data);
          }
          setIsLoading(false);
          setRefresh(false);
        })   
    }        
  }, [refreshMe]);*/

  const deleteAndRefresh = () => {
    setIdToDelete("");
    setRefresh(true);
  }

  return (       
    <Layout>      
      <Head>
        <title>
          Wallets
        </title>
      </Head>
      {        
        !walletData &&
        <LoadingBackdrop isLoading={true} />
      } 
      <ShowAlert severity="warning" label={"ATTENTION : this page is still under development"} />     
      <Box component="div" m={1} className={classes.newWalletContainer}>
        <Button 
          className={classes.newWalletButton}
          variant="contained" 
          color="primary" 
          size="medium"
          startIcon={<Add />}
          endIcon={<AccountBalanceWallet />}
          onClick={()=>setAddingWallet(true)}
          disabled={error!==""}
        >
          New Wallet
        </Button>
      </Box>      
      <Typography variant={"h4"} className={classes.walletListHeader}>My Wallets</Typography>              
      <Container>                
        {
          walletData &&
          !walletFetchErr &&
          (
            walletData.length > 0 ?
            <Grid container spacing={1}>
              {walletData.map((d, i) => <Wallet 
                                          key={d._id}
                                          walletData={d}
                                          setEdit={()=>{setIdEdit(d._id)}}
                                          setDelete={()=>{setIdToDelete(d._id)}}
                                          refresh={refreshMe}
                                        />
                            )}
            </Grid>
            :
            <p>No Wallets...</p>
          )
        }
      </Container>
      {
        addingWallet &&
        <AddWalletDialog 
          open={addingWallet} 
          cancelAdd={()=>{setAddingWallet(false)}} 
          finishAndRefresh={()=>{setRefresh(true); setAddingWallet(false);}}
        />
      }
      {
        idEdited!=="" &&
        <EditWalletDialog 
          open={idEdited!==""} 
          cancelEdit={() => {setIdEdit("")}}
          finishAndRefresh={()=>{setRefresh(true); setIdEdit("");}}
          walletToEdit={walletData.filter(d=>d._id===idEdited)[0]}
          deleteInstead={()=>{
            const walletToEdit = walletData.filter(d=>d._id===idEdited)[0];
            setIdEdit("");
            setIdToDelete(walletToEdit._id);                        
          }}
        />
      }
      {
        idToDelete!=="" &&
        <DeleteWalletDialog 
          open={idToDelete!==""} 
          cancelDelete={() => {setIdToDelete("")}}
          deleteAndRefresh={()=>{deleteAndRefresh()}}
          walletToDelete={walletData.filter(d=>d._id===idToDelete)[0]}
          editInstead={()=>{
            const walletToDelete = walletData.filter(d=>d._id===idToDelete)[0];
            setIdToDelete("");
            setIdEdit(walletToDelete._id);
          }}
        />
      }
      {
				walletFetchErr &&
				<ShowAlert severity={"error"} label={`ERROR : ${JSON.stringify(walletFetchErr)}`} />
			}
    </Layout>       
  )
}