'use client'

import Styles from './findpw.module.css';
import { useState, useEffect } from 'react';

export default function SignUp() {
  const [emailCheck, setEmail] = useState(true);
  const [verifyCheck, setVerify] = useState(true);

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이메일</p>
          <div className={Styles.Right}>
            <input 
              placeholder='ABC123@abc.com'
              className={Styles.InputBox} 
              id='email_box'
            />
            <button className={Styles.BlueButton}>인증번호 전송</button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'email_check'} style={{display: emailCheck ? 'list-item' : 'none'}}>존재하지 않는 이메일입니다!</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>인증번호</p>
          <div className={Styles.Right}>
            <input 
              placeholder='123456'
              className={Styles.InputBox}
              id='verify_box'
              onChange={(e)=>{
              }}
            />
            <button className={Styles.BlueButton}>인증번호 확인</button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'verify_check'} style={{display: verifyCheck ? 'list-item' : 'none'}}>인증번호가 일치하지 않습니다.</li>
            </ul>
          </div>
        </div>

        <div className={Styles.IDBox}>
          <h4 className={Styles.foundID}>찾은 ID</h4>
          <h2 className={Styles.BoldID}>abcd1234</h2>
        </div>
        
        <button className={Styles.BlueButton}>로그인하러 가기</button>
        
      </div>
    </div>
  );
}