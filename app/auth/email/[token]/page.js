'use client'

import Styles from './email.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Club({ params }) {
  const router = useRouter();
  const [status, setStatus] = useState("응답을 기다리는 중");

  const tokenAPI = async (token) => {
    const getURL = '/api/auth/email/' + token;
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