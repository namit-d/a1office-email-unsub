import logo from './logo.svg';
import './App.css';
import CryptoJS, { AES } from 'crypto-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [userEmail, setUserEmail] = useState('');

  const getUserDetailsFromUrl = async () => {

    const hash = window.location.href.split('?')[1];
    console.log(hash);
    console.log(process.env.REACT_APP_ENC_KEY);
    const bytes = await AES.decrypt(hash, process.env.REACT_APP_ENC_KEY);
    console.log(bytes);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8).split('-');
    console.log(decryptedData);
    const uid = decryptedData[0];
    const uEmail = decryptedData[1];
    
    setUserEmail(uEmail)
    if (userEmail !== '') {
      unsubscribeUser(uid, uEmail)
    }
    return { uid: uid, uEmail: uEmail }

  }

  const unsubscribeUser = async (uid, uEmail) => {
    // const { uid, uEmail } = await getUserDetailsFromUrl();
    const formData = new FormData();
    formData.append("uid", uid);

    await axios({
      method: "POST",
      url: process.env.REACT_APP_API_URL,
      data: formData,
      headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // 'Access-Control-Allow-Origin': '*',
    }
    }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  })

}

useEffect(() => {
  getUserDetailsFromUrl();
}, [userEmail])

return (
  <div className="App">
    <header className="App-header">
    </header>
    <div className="body">

     <h2>{userEmail} has been unsubscribed from our mailing list.</h2>
    </div>
  </div>
);
}

export default App;
