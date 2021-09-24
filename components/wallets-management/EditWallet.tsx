import { useState, useEffect } from 'react';
import {
            Button, Card, CardActionArea, CardMedia, CircularProgress, Dialog, DialogTitle, 
            DialogContent, DialogActions, Grid, IconButton, TextField
       } from '@material-ui/core';
import { PhotoCamera, DeleteForever } from '@material-ui/icons';       
import { API } from "../../config";
import ShowAlert from '../globals/Alert';
import DialogSlide from '../globals/DialogSlide';
import { updateWallet } from "../../api/walletApi";
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
  
    const submitData = (e) => {
        e.preventDefault();
        
        if(!editDirty){
            cancelEdit();
        }
    
        if(walletError!==""){
            return;
        }
    
        const formData = new FormData();
        formData.set("name", walletName);
        formData.set("balance", balance.toString());
        if(newImg!==null){
            console.log('icon changed');
            formData.set("icon", newImg);
        }    
    
        setIsSubmitting(true);
        updateWallet(formData, walletToEdit._id)
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
                    finishAndRefresh();
                }
            })   
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
                                <CardMedia 
                                    style={{width:'100%', height:'194px'}}         
                                    image={displayPic==null?`${API}/wallet/photo/${walletToEdit._id}`:displayPic}
                                    title="Wallet Icon"
                                />
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