'use client'

import Styles from '../findpw.module.css';
import { useState, useEffect } from 'react';

export default function findPWToken({params}) {
  const token = params.token;
  return (
    <div className={Styles.Panel}>
      <div className={Styles.Top}>
        <h1 className={Styles.Title}>비밀번호 초기화</h1>
      </div>

      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'email_check'}>잠시 기다려주십시오.</li>
              <li id={'email_check'}>새로운 비밀번호가 메일로 전송되었습니다!</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}