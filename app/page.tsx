"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from 'react';
import axios from "axios";

export default function Home() {

  const [token, setToken] = useState('');
  const [data, setData] = useState('');

  const login = async () => {
    const response = await axios.post('http://localhost:5001/login/',
    { username: 'usernamea', password: 'passworda'})
    // Handle the response from backend here
    .then((res) => {
      console.log("token frontend: ",res.data.token);
      setToken(res.data.token);
    })
    // Catch errors if any
    .catch((err) => {});    
  };

  const fetchData = async () => {
        
    const response = await axios({
      method: 'GET',
      url: 'http://localhost:5001/api/data/',      
      headers: {
        Authorization: token,
      },
    })    
    .then((res) => {
      console.log(res);
      setData(res.data.message);
    })
    
    .catch((err) => {});  
  };

  return (
    <main className={styles.main}>   

      <div>
        <button className={styles.gbutton} onClick={login}>
          Login
        </button>
        {token && <button className={styles.bbutton} onClick={fetchData}>Fetch Data</button>}
        <div>{data}</div>
      </div>
    </main>
  );
}
