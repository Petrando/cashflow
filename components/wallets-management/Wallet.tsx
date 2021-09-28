import { useEffect, useState} from 'react';
import Link from 'next/link';
import { 
          Grid, 
          ButtonGroup, 
          Button, 
          IconButton, 
          Card, 
          CardHeader,
          CardMedia,
          CardActionArea,           
          CardActions, 
      } from '@material-ui/core';
import { List, Edit, Delete } from '@material-ui/icons';
import { rupiahFormatter } from '../../util-functions';
import fetchJson from '../../lib/fetchJson';
import { API } from "../../config";
import { walletDisplayI } from '../../types';
import {useWalletStyles} from '../../styles/material-ui.styles';

const Wallet = ({ walletData, setEdit, setDelete}:walletDisplayI):JSX.Element => {
    const classes = useWalletStyles();    
    const {_id, name, balance} = walletData;   
    const [iconData, setIconData] = useState();  

    useEffect(()=>{
      console.log('icon id : ');
      console.log(_id);
      
      getIcon();
    }, []);

    const getIcon = async () => {
      try {
        const getIconResult = await fetchJson("/api/wallets/get-wallet-icon", {
          method: "POST",            
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
          },
          body: JSON.stringify({walletId:_id})
        });          
         
        setIconData(getIconResult)            
      } catch (error) {
        console.error("An unexpected error happened:", error);
      }   
    }

    //`${API}/wallet/photo/${_id}?random=${Math.floor(Math.random() * 100)}`

    return (
      <Grid item lg={3} md={4} sm={6} xs={12} key={_id}>
        <Card>
          <CardActionArea>
            <CardHeader 
              title={name}
              subheader={rupiahFormatter(balance)}
            />
            {
              iconData &&
              <CardMedia 
                component="img"
                height="194"
                src={`data:${iconData["Content-Type"]};base64, ${iconData["data"]}`}
              /> 
            }                       
          </CardActionArea>
          <CardActions >                                          
            <Link href={{ pathname: `/transactions`, query: { _id, name, balance } }} >
            <a>
            <Button 
                color="primary" 
                variant="contained"
                startIcon={<List />}
                className={classes.walletButton} 
            >        
              Transactions
            </Button>
            </a>
            </Link>                                    
            <ButtonGroup>
              <IconButton color="primary"                
                onClick={()=>{setEdit()}}
                className={classes.walletButton}             
              > 
                <Edit />
              </IconButton>
              <IconButton color="secondary"                 
                onClick={()=>{setDelete()}}
                className={classes.walletButton}
              >
                <Delete />
              </IconButton> 
            </ButtonGroup>      
          </CardActions>
        </Card>
      </Grid>
    )
  }

  export default Wallet;