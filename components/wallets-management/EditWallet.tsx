import { useState, useEffect } from 'react';
import {
            Button, Card, CardActionArea,  CircularProgress, Dialog, DialogTitle, 
            DialogContent, DialogActions, Grid, IconButton, TextField
       } from '@material-ui/core';
import { PhotoCamera, DeleteForever } from '@material-ui/icons';       
import ShowAlert from '../globals/Alert';
import DialogSlide from '../globals/DialogSlide';
import WalletIcon from './WalletIcon';
import fetchJson from '../../lib/fetchJson';
import {editWalletI} from "../../types";
import { useWalletStyles } from "../../styles/material-ui.styles";

function EditWalletDialog({ 
                            open, 
                            cancelEdit, 
                            finishAndRefresh, 
                            deleteInstead, 
                            walletToEdit 
                        }:editWalletI):JSX.Element {  
    const classes = useWalletStyles();
    

    const [walletName, setWalletName] = useState<string>('');
    const [walletError, setWalletError] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [newImg, setNewImg] = useState(null);
    const [displayPic, setDisplayPic] = useState(null);   
    const [imgError, setImgError] = useState<string>("");
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");

    const editDirty:boolean = walletName!==walletToEdit.name || balance!==walletToEdit.balance || newImg!==null;

    useEffect(()=>{        
        initializeEditData();
    }, []);

    useEffect(()=>{
        if(imgError!==""){
            setTimeout(()=>{
                setImgError("");
            }, 5000)
        }
    }, [imgError]);
    
    const initializeEditData = () => {  
        setWalletName(walletToEdit.name);
        setBalance(walletToEdit.balance);
        setWalletError('');
        setNewImg(null);
        setDisplayPic(null);
        setSubmitError("");
    }
  
    const submitData = async (e) => {
        e.preventDefault();
        
        if(!editDirty){
            cancelEdit();
        }
    
        if(walletError!==""){
            return;
        }
    
        const formData = new FormData();
        formData.set("id", walletToEdit._id);
        formData.set("name", walletName);
        formData.set("balance", balance.toString());
        if(newImg!==null){
            formData.set("icon", newImg);
        }    
    
        setIsSubmitting(true);  
    
        try {
            const updateResult = await fetchJson("/api/wallets/update-wallet", {
                method: "POST",              
                headers: {
                              Accept: 'application/json'
                          },
                body: formData
            });
                           
            const { acknowledged, modifiedCount } = updateResult;
            if(acknowledged && modifiedCount === 1) {
              finishAndRefresh();              
            }
                  
        } catch (error) {
            console.error("An unexpected error happened:", error);            
        } finally {
            setIsSubmitting(false);
        }
    }
  
    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>{!isSubmittingData && cancelEdit()}} 
            aria-labelledby="simple-dialog-title" 
            open={open}
            TransitionComponent={DialogSlide}
        >
            <DialogTitle id="simple-dialog-title">
            {
                !isSubmittingData?'Edit Wallet':'Submitting...'
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
                !isSubmittingData &&
                <>
                <TextField
                    autoFocus
                    error={walletError?true:false}
                    helperText={walletError}
                    margin="dense"
                    id="name"
                    label="Wallet Name"
                    type="text"
                    value={walletName}
                    onChange={(e)=>{
                        setWalletName(e.target.value);            
                    }}
                    onFocus={()=>{setWalletError("")}}
                    onBlur={()=>{
                        if(walletName===""){
                            setWalletError("Wallet name is required.")
                        }
                    }}
                    fullWidth
                    disabled={isSubmittingData}
                />
                <TextField          
                    margin="dense"
                    id="name"
                    label="Balance"
                    type="number"
                    value={balance}
                    onChange={(e)=>{
                        const {value} = e.target;
                        const newValue = parseInt(value);
                        const newBalance = (isNaN(newValue) || newValue < 0)?0:newValue;
                        setBalance(newBalance);
                    }}
                    fullWidth
                    disabled={isSubmittingData}
                />
                <Grid container>
                    <Grid item xs={12} className={classes.walletImageContainer}>
                        <Card className={classes.walletImage}>
                            <CardActionArea>
                                <WalletIcon id={walletToEdit._id} displayPic={displayPic} />
                            </CardActionArea>
                        </Card>
                        <Button 
                            variant="contained"
                            component="label"
                            color="primary"                                    
                            endIcon={<PhotoCamera />}
                        >
                            Wallet Icon                            
                            <input
                                type="file"
                                hidden
                                onChange={(evt)=>{  
                                    if(typeof evt.target.files[0] === 'undefined'){
                                        return;
                                    }                                     
                                    const imageFile = evt.target.files[0];
                                    if(imageFile.size > 1000000){
                                        setNewImg(null);
                                        setDisplayPic(null);
                                        setImgError("New mage must be smaller than 1MB.")
                                        return;
                                    }else {
                                        setNewImg(imageFile);
                                        setDisplayPic(URL.createObjectURL(imageFile));
                                        setImgError("");                                    
                                    }
                                }}                                
                            />
                        </Button >
                    </Grid>                    
                </Grid>
                </>
            }
            {
                !isSubmittingData &&
                imgError !=="" &&
                <ShowAlert 
                    severity={"warning"}
                    label={imgError}
                    handleClose={()=>{
                        setImgError("");
                    }}
                />
            }
            {
                isSubmittingData && 
                <p style={{textAlign:'center'}}>
                    <CircularProgress />
                </p>
            }       
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={submitData} 
                    color="primary"
                    variant="contained"
                    disabled={isSubmittingData}
                >
                    Submit
                </Button>
                <Button 
                    onClick={initializeEditData} 
                    color="primary"
                    variant="contained"
                    disabled={isSubmittingData || !editDirty}
                >
                    Reset
                </Button>
                <Button 
                    onClick={()=>!isSubmittingData && cancelEdit()} 
                    color="secondary"
                    variant="contained"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button> 
                <IconButton
                    color="secondary"
                    onClick={()=>{deleteInstead()}}  
                    disabled={isSubmittingData}                  
                >
                    <DeleteForever />
                </IconButton>       
            </DialogActions>
        </Dialog>
    );
  }

  export default EditWalletDialog;