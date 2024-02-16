'use client'

import Styles from './password.module.css'
import { signOut } from "next-auth/react"
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function password() {
  const router = useRouter();
  const nowPw = useRef(null);
  const [pwLogic, setPwLogic] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  })
  const [newPwCheck, setNewPwCheck] = useState(false);

  const submitHandler = async (e) => {
    if (nowPw.current.value.length < 1) return alert('현재 비밀번호를 입력해주세요.');
    for (const check in pwLogic) {
      if (!pwLogic[check]) return alert('새 비밀번호의 양식을 다시 확인해 주세요.');
    }
    if (!newPwCheck) return alert('새 비밀번호가 일치하지 않습니다.');
    
    const res = await fetch(`/api/users/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: nowPw.current.value,
        newPassword: document.getElementById('password').value
      })
    });

    if (res.status == 201) {
      return signOut({ callbackUrl: '/infomessage/pwchange'});
    } else if (res.status == 400) {
      return alert('현재 비밀번호가 일치하지 않습니다.');
    } else if (res.status == 401) {
      alert('로그인 후 다시 진행해주세요');
      return router.push('/login');
    }
  }

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
        
        <button className={Styles.BlueButton} onClick={submitHandler}>변경하기</button>

      </div>
    </div>
  )
}