import {API} from '../config';
import checkResponse from './checkResponse';

export async function getWallets() {    
  return fetch(`${API}wallet`)
    .then(res => {
      checkResponse(res);
      return res.json();
    })
    .catch(err => {
      console.log(err);
      return {error:err};
    })
}

export const createWallet =  (walletData) => {    
  return fetch(`${API}wallet/create/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json'      
    },
    body: walletData
  })
  .then(res => {
    checkResponse(res);
    return res.json();
  })
  .catch(err => {
    console.log(err);
    return {error:err};
  })
}

export const updateWallet = (updatedWallet, walletId) => {  
  return fetch(`${API}wallet/update/${walletId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json'      
    },
    body: updatedWallet
  })
  .then(res => {
    checkResponse(res);
    return res.json();
  })
  .catch(err => {
    console.log(err);
    return {error:err};
  })
}

export const deleteWallet = (walletId) => {
  return fetch(`${API}wallet/delete/${walletId}`, {method: 'DELETE'})
  .then(res => {
    checkResponse(res);
    return res.json();
  })
  .catch(err => {
    console.log(err);
    return {error:err};
  })
}