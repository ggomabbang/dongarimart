'use client'

import Styles from './email.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Club({ params }) {
  const [status, setStatus] = useState("응답을 기다리는 중");

  const tokenAPI = async (token) => {
    const getURL = 'http://localhost:3000/api/auth/email/' + token;
    const res = await fetch(getURL, {
      method: 'GET'
    });
    console.log(res);
    if (res.status == 200) {
      setStatus('완료');
    } else {
      setStatus('실패');
    }
  }

  useEffect(() => {
    tokenAPI(params.token)
  }, []);

  return (
    <div className={Styles.Container}>
      {status}
    </div>
  )
}