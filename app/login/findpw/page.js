'use client'

import Styles from './findpw.module.css';
import { useState, useEffect } from 'react';

export default function findPW() {

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Top}>
        <h1 className={Styles.Title}>비밀번호 초기화</h1>
      </div>

      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이메일</p>
          <div className={Styles.Right}>
            <input 
              placeholder='ABC123@pusan.ac.kr'
              className={Styles.InputBox} 
              id='email_box'
            />
            <button className={Styles.BlueButton}>인증링크 전송</button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'email_check'}>정상적인 이메일만 메일이 전송됩니다!</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}