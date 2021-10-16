import {useState} from 'react';
import Link from "next/link";
import {         
        Button, 
        Card,
        CardActionArea,
        CardActions,
        CardHeader,
        Dialog, 
        DialogTitle, 
        DialogContent, 
        DialogActions, 
        Grid, 
        IconButton 
      } from '@material-ui/core';
import {Block, DeleteForever, Edit, List} from '@material-ui/icons';
import ShowAlert from '../globals/Alert';
import { LoadingDiv } from '../globals/LoadingBackdrop';
import DialogSlide from '../globals/DialogSlide';
import WalletIcon from './WalletIcon';
import { deleteWalletI } from "../../types";
import fetchJson from '../../lib/fetchJson';
import { rupiahFormatter } from '../../lib/currencyFormatter';

function DeleteWalletDialog({ 
                                cancelDelete, 
                                open, 
                                deleteAndRefresh, 
                                editInstead,
                                walletToDelete:{_id, name, balance}
                            }:deleteWalletI):JSX.Element {      
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
    
    const submitData = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);     
        /*
        deleteWallet(_id)
            .then(data => {       
                if(typeof data==='undefined'){
                    setSubmitError("No return type?");
                    setIsSubmitting(false);
                    return;          
                }
                if(data.error){          
                    setSubmitError("Please check your connection.");
                    setIsSubmitting(false);
                } else {          
                    setIsSubmitting(false);
                    deleteAndRefresh();
                }
            }) */
        try {
            const deleteResult = await fetchJson("/api/wallets/delete-wallet", {
                method: "DELETE",              
                headers: {
                            Accept: 'application/json',
                            "Content-Type": "application/json"
                },
                body: JSON.stringify({walletId:_id})
            });
                   
            const { acknowledged, deletedCount } = deleteResult;   
            if(acknowledged && deletedCount === 1) {
              deleteAndRefresh();
            }                             
        } catch (error) {
            console.error("An unexpected error happened:", error);            
        } finally {
            setIsSubmitting(false);
        }
    }
  
    const dialogContent = () => (
        <Grid container>          
            <Grid item xs={12} >                          
                <Card>
                    <CardActionArea>
                        <CardHeader 
                            title={name}
                            subheader={rupiahFormatter(balance)}
                        />
                        <WalletIcon id={_id} />       
                    </CardActionArea>
                    <CardActions >                                          
                        <Link href={{ pathname: `/transactions`, query: { _id, name, balance } }} >
                            <a>
                            <Button 
                                color="primary" 
                                variant="contained"
                                size="small"
                                startIcon={<List />}                                        
                            >        
                                See Transactions
                            </Button>
                            </a>
                        </Link> 
                    </CardActions>
                </Card>         
            </Grid>
            </Grid>
    );

    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>!isSubmittingData && cancelDelete()} 
            aria-labelledby="simple-dialog-title" 
            open={open}
            TransitionComponent={DialogSlide}
        >
            <DialogTitle id="simple-dialog-title">                
            {
                isSubmittingData ?
                "Deleting....":
                "Delete this wallet?"
            }
            {
                !isSubmittingData && submitError!=="" &&
                <ShowAlert
                    severity={"error"}
                    label={submitError}
                />
            }
            </DialogTitle>
            <DialogContent>
            {
                !isSubmittingData?
                dialogContent():
                <LoadingDiv />
            }                                        
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitData} 
                    color="primary"
                    variant="contained"
                    startIcon={<DeleteForever />}
                    disabled={isSubmittingData}
                >
                    Delete
                </Button>
                <Button 
                    onClick={()=>!isSubmittingData && cancelDelete()} 
                    color="secondary"
                    variant="contained"
                    disabled={isSubmittingData}
                    startIcon={<Block />}
                >
                    Cancel
                </Button> 
                <IconButton 
                    onClick={()=>!isSubmittingData && editInstead()}                  
                    color="primary"                    
                    disabled={isSubmittingData}                   
                >
                    <Edit />
                </IconButton>        
            </DialogActions>
        </Dialog>
    );
  }

  export default DeleteWalletDialog;