import { useState, useEffect } from "react";
import { CardMedia } from '@material-ui/core';
import { LoadingDiv } from "../globals/LoadingBackdrop";
import fetchJson from "../../lib/fetchJson";
import { useWalletStyles } from "../../styles/material-ui.styles";
import { walletIconI } from "../../types";

const WalletIcon = ({id, displayPic}:walletIconI):JSX.Element => {
  const classes = useWalletStyles();
  const [iconData, setIconData] = useState();  

  useEffect(()=>{
      getIcon();
  }, []);

  const getIcon = async () => {
      try {
        const getIconResult = await fetchJson(`/api/wallets/get-wallet-icon?random=${Math.floor(Math.random() * 100)}`, {
          method: "POST",            
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
          },
          body: JSON.stringify({walletId:id})
        });          
         
        setIconData(getIconResult)            
      } catch (error) {
        console.error("An unexpected error happened:", error);
      }   
  }

  return (
    <>
    {
      iconData?
      <CardMedia 
        component="img"
        className={classes.walletIcon}
        image={
                (!displayPic || displayPic===null)?
                `data:${iconData["Content-Type"]};base64, ${iconData["data"]}`:
                displayPic
              }
      />:
      <LoadingDiv /> 
    }
    </>
  )
}

export default WalletIcon;