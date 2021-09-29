import { useState } from 'react';
import {
            Button, Card, CardActionArea, CardMedia, CircularProgress, Dialog, DialogTitle, 
            DialogContent, DialogActions, Grid, TextField, Typography
       } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';       
import DialogSlide from '../globals/DialogSlide';
import ShowAlert from '../globals/Alert';
import fetchJson from '../../lib/fetchJson';
import { createWallet } from "../../api/walletApi";
import { useWalletStyles } from "../../styles/material-ui.styles";
import { addWalletI} from "../../types";

function AddWalletDialog({ open, cancelAdd, finishAndRefresh }:addWalletI):JSX.Element {    
    const classes = useWalletStyles();
    const [walletName, setWalletName] = useState<string>('');
    const [walletError, setWalletError] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [imgFile, setImgFile] = useState(null);  
    const [imgError, setImgError] = useState<string>('');
    const [displayPic, setDisplayPic] = useState(null);   
    const [isSubmittingData, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
      
    const submitData = async (e) => {
        e.preventDefault();       
        if(imgFile===null){      
            setImgError("Wallet Icon is required.")
        }
        if(walletError!==""||imgError!==""||imgFile===null){
            return;
        }
  
        const formData = new FormData();
        formData.set("name", walletName);
        formData.set("balance", balance.toString());
        formData.set("icon", imgFile);
  
        setIsSubmitting(true);
    
        try {
          const addResult = await fetchJson("/api/wallets/create-wallet", {
              method: "POST",              
              headers: {
                          Accept: 'application/json'
                        },
              body: formData
          });
              
          if(addResult.message==="success"){
            setIsSubmitting(false);
            finishAndRefresh();
          }else{
            setIsSubmitting(false);
          }
              
        } catch (error) {
            console.error("An unexpected error happened:", error);
            setIsSubmitting(false);
        }
    }
  
    return (
        <Dialog 
            fullWidth={true} 
            maxWidth={'sm'}
            onClose={()=>{!isSubmittingData && cancelAdd()}} 
            aria-labelledby="add-wallet-dialog" 
            open={open}
            TransitionComponent={DialogSlide}
        >
            <DialogTitle id="add-wallet-dialog">
            {
                !isSubmittingData?'Add New Wallet':'Submitting...'
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
                    {
                        imgError!=="" &&
                        <Grid item xs={12}>
                        <Typography variant="body2" color="error" gutterBottom>
                            {imgError}
                        </Typography>
                        </Grid>
                    }
                    <Grid item xs={12} className={classes.walletImageContainer}>
                        {
                            displayPic!==null &&
                            <Card className={classes.walletImage}>
                                <CardActionArea>
                                    <CardMedia 
                                        style={{width:'100%', height:'194px', objectFit:"fill"}}         
                                        image={displayPic}
                                        title="Wallet Icon"
                                    />
                                </CardActionArea>
                            </Card>
                        }
                        <Button 
                            variant="contained"
                            component="label"
                            color="primary"                                    
                            endIcon={<PhotoCamera />}
                            id="photoButton"          
                            onClick={()=>{setImgError("")}}                  
                        >
                            Wallet Icon                            
                            <input
                                type="file"
                                hidden
                                name="photoInput"
                                onChange={(evt)=>{                                      
                                    if(typeof evt.target.files[0] === 'undefined'){
                                        return;
                                    }                                     
                                    const imageFile = evt.target.files[0];
                                    if(imageFile.size > 1000000){
                                        setImgFile(null);
                                        setDisplayPic(null);
                                        setImgError("Image must be smaller than 1MB, please choose another.")
                                        return;
                                    }else {
                                        setImgFile(imageFile);
                                        setDisplayPic(URL.createObjectURL(imageFile));
                                        setImgError("");                                    
                                    }                                    
                                }}
                                onBlur={()=>{
                                    if(imgFile===null){
                                        setImgError("Wallet Icon is required.")
                                    }
                                }}
                            />
                        </Button >                        
                    </Grid>                    
                </Grid>
                </>
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
                    onClick={()=>!isSubmittingData && cancelAdd()} 
                    color="secondary"
                    variant="contained"
                    disabled={isSubmittingData}
                >
                    Cancel
                </Button>        
            </DialogActions>
        </Dialog>
    );
  }

  export default AddWalletDialog;