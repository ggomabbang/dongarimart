'use client'

import Styles from '@/app/infomessage/Info.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Club({ params }) {
  const router = useRouter();
  const [status, setStatus] = useState("응답을 기다리는 중");
  const [buttonShow, setButtonShow] = useState(false);

  const tokenAPI = async (token) => {
    const getURL = '/api/auth/email/' + token;
    const res = await fetch(getURL, {
      method: 'GET'
    });
    console.log(res);
    if (res.status == 200) {
      setStatus('이메일 인증이 완료되었습니다!');
      setButtonShow(true);
    } else {
      setStatus('실패. 로그인 후 My 페이지에서 다시 시도해주세요.');
    }
  }

  useEffect(() => {
    tokenAPI(params.token)
  }, []);

  return (
    <div className={Styles.Container}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
          {status}
          {
            buttonShow ? 
            <button className={Styles.BlueButton} onClick={(e) => router.push('/')}>
              메인페이지로 돌아가기
            </button> : null
          }
        </div>
      </div>
    </div>
  )
}