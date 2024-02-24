'use client'

import Styles from '@/app/component/inputPanel.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function findPW() {
  const router = useRouter();
  const [emailCheck, setEmailCheck] = useState(false);

  const submitHandler = async (e) => {
    const email = document.getElementById('email_box').value;

    if (email === '') return alert("이메일을 입력해주세요.");
    
    const res = await fetch(`/api/auth/email/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email
      })
    });

    switch (res.status) {
      case 204:
        return router.push(`/infomessage/emailcheck/${email.split('@')[0]}`)
      case 400:
        alert('입력 양식을 다시 확인해 주세요');
        return router.push('/');
    }
  }
  return (
    <div className={Styles.Container}>
      <div className={Styles.Top}>
        <h1 className={Styles.PageTitle}>비밀번호 초기화</h1>
      </div>

      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이메일</p>
          <div className={Styles.Right}>
            <input 
              placeholder='ID@pusan.ac.kr'
              className={Styles.InputBox} 
              id='email_box'
              onChange={(e) => {
                const email = e.target.value;
                // 이메일 형식 확인
                const emailRE = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@pusan.ac.kr");
                let resultRE = emailRE.exec(email);
                if (resultRE === null) {
                  setEmailCheck(false);
                }
                else {
                  setEmailCheck(true);
                }
              }}
            />
            <button className={Styles.BlueButton} onClick={submitHandler}>인증링크 전송</button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li style={{display: emailCheck ? 'none' : 'list-item'}}>부산대학교 이메일 'ID@pusan.ac.kr'만 허용합니다.</li>
              <li id={'email_check'} style={{color: 'black'}}>가입된 이메일만 메일이 전송됩니다!</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}