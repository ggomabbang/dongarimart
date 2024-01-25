'use client'

import Styles from './password.module.css';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Password() {
  const router = useRouter();
  const nowPw = useRef(null);
  const [pwLogic, setPwLogic] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  })
  const [newPwCheck, setNewPwCheck] = useState(false);

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>현재 비밀번호</p>
          <div className={Styles.Right}>
            <input 
              type='password'
              placeholder='****'
              className={Styles.InputBox} 
              ref={nowPw}
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>새 비밀번호</p>
          <div className={Styles.Right}>
            <input 
              placeholder='****'
              className={Styles.InputBox}
              type='password'
              id='password'
              onChange={(e)=>{
                const pw = e.target.value;
                const newStyle = pwLogic;
                document.getElementById('password_check').value = '';
                setNewPwCheck(false);
                
                if (8 <= pw.length && pw.length <= 22) {
                  newStyle[1] = true;
                } else {
                  newStyle[1] = false;
                }

                if (pw != pw.toUpperCase() && pw != pw.toLowerCase()) {
                  newStyle[2] = true;
                } else {
                  newStyle[2] = false;
                }

                if (/[`~!@#$%^&*|'";:₩\\?\-_+=]/g.test(pw)) {
                  newStyle[3] = true;
                } else {
                  newStyle[3] = false;
                }

                if (/[0-9]/g.test(pw)) {
                  newStyle[4] = true;
                } else {
                  newStyle[4] = false;
                }

                setPwLogic({...newStyle});
              }}
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li style={{display: pwLogic[1] ? 'none' : 'list-item'}}>8 ~ 22자리 이내로 입력해주세요.</li>
              <li style={{display: pwLogic[2] ? 'none' : 'list-item'}}>대문자와 소문자를 같이 포함해주세요.</li>
              <li style={{display: pwLogic[3] ? 'none' : 'list-item'}}>특수문자를 포함해주세요. <br/>허용 특수문자: `~!@#$%^&*|'";:₩\?-_+=</li>
              <li style={{display: pwLogic[4] ? 'none' : 'list-item'}}>숫자를 포함해주세요.</li>
              <li style={{display: Object.values(pwLogic).includes(false)? 'none' : 'list-item', color: 'green'}}>안전한 비밀번호입니다.</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>비밀번호<br/>확인</p>
          <div className={Styles.Right}>
            <input 
              placeholder='****'
              className={Styles.InputBox}
              type='password'
              id='password_check'
              onChange={(e) => {
                const pw = e.target.value;

                if (pw == document.getElementById('password').value) {
                  setNewPwCheck(true);
                } else {
                  setNewPwCheck(false);
                }
              }}
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li style={{display: newPwCheck ? 'none' : 'list-item'}}>비밀번호가 일치하지 않습니다.</li>
              <li style={{display: !newPwCheck ? 'none' : 'list-item', color: 'green'}}>비밀번호가 일치합니다.</li>
            </ul>
          </div>
        </div>
        
        <button className={Styles.BlueButton}>변경하기</button>
      </div>
    </div>
  )
}