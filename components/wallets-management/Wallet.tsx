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
import { API } from "../../config";
import { walletDisplayI } from '../../types';
import {useWalletStyles} from '../../styles/material-ui.styles';

const Wallet = ({ walletData, setEdit, setDelete}:walletDisplayI):JSX.Element => {
    const classes = useWalletStyles();    
    const {_id, name, icon, balance} = walletData;

    return (
      <Grid item lg={3} md={4} sm={6} xs={12} key={_id}>
        <Card>
          <CardActionArea>
            <CardHeader 
              title={name}
              subheader={rupiahFormatter(balance)}
            />
            <CardMedia 
              component="img"
              height="194"
              src={`${API}/wallet/photo/${_id}?random=${Math.floor(Math.random() * 100)}`}
            />            
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