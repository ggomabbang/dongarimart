'use client'

import Styles from '@/app/infomessage/Info.module.css';
import { useState, useEffect } from 'react';

export default function findPWToken({params}) {
  const [apiSuccess, setApiSuccess] = useState(false);

  const tokenAPI = async (token) => {
    const res = await fetch('/api/users/password', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token
      })
    });
    switch (res.status) {
      case 200:
        return setApiSuccess(true);
      case 401:
        return alert('토큰 오류');
      default:
        return alert('Unknown Error');
    }
  }

  const submitHandler = async (e) => {
    return router.push('/login');
  }

  useEffect(() => {
    tokenAPI(params.token)
  }, []);

  return (
    <div className={Styles.Container}>
      <div className={Styles.Top}>
        <h1 className={Styles.PageTitle}>비밀번호 초기화</h1>
      </div>

      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            {
              apiSuccess ?
              '새로운 비밀번호가 메일로 전송되었습니다!':
              '잠시 기다려주십시오.'
            }
          </div>
        </div>
            {
              apiSuccess ?
              <button className={Styles.BlueButton} onClick={submitHandler}>로그인하러가기</button>
              : null
            }
        
      </div>
    </div>
  );
}