'use client'

import Styles from './SignUp.module.css';
import { useState, useEffect } from 'react';

export default function SignUp() {
  const [nameCheck, setNameCheck] = useState(false);
  const [nameUnduplicated, setNameUnduplicated] = useState(false);
  const [pwStyle, setPwStyle] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [pwCheck, setPwCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailUnduplicated, setEmailUnduplicated] = useState(false);

  const submitHandler = (e) => {
    const checks = [nameCheck, nameUnduplicated, pwCheck, emailCheck, emailUnduplicated];
    for (const check in checks) {
      if (!checks[check]) return alert('가입 양식이 잘못되었습니다.');
    }
    for (const check in pwStyle) {
      if (!pwStyle[check]) return alert('가입 양식이 잘못되었습니다.');
    }

    alert('API 호출');
  }
  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>닉네임</p>
          <div className={Styles.Right}>
            <input 
              placeholder='User Name'
              className={Styles.InputBox} 
              id='ID_box'
              onChange={(e) => {
                const name = e.target.value;
                if (name.length) setNameCheck(true);
                else setNameCheck(false);
              }}
            />
            <button className={Styles.BlueButton}>중복확인</button>
          </div>
        </div>
        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'name_check_1'} style={{display: nameCheck ? 'none' : 'list-item'}}>닉네임을 입력해 주세요.</li>
              <li id={'name_check_2'} style={{display: nameUnduplicated ? 'none' : 'list-item'}}>중복 확인을 눌러주세요.</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>비밀번호</p>
          <div className={Styles.Right}>
            <input 
              placeholder='****'
              className={Styles.InputBox}
              type='password'
              id='password'
              onChange={(e)=>{
                const pw = e.target.value;
                const newStyle = pwStyle;

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

                if (/[`~!@#$%^&*|'";:₩\\?-_+=]/g.test(pw)) {
                  newStyle[3] = true;
                } else {
                  newStyle[3] = false;
                }

                console.log(newStyle);
                setPwStyle({...newStyle});
              }}
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'pw_1'} style={{display: pwStyle[1] ? 'none' : 'list-item'}}>8 ~ 22자리 이내로 입력해주세요.</li>
              <li id={'pw_2'} style={{display: pwStyle[2] ? 'none' : 'list-item'}}>대문자와 소문자를 같이 포함해주세요.</li>
              <li id={'pw_3'} style={{display: pwStyle[3] ? 'none' : 'list-item'}}>특수문자를 포함해주세요. <br/>허용 특수문자: `~!@#$%^&*|'";:₩\?-_+=</li>
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
                  setPwCheck(true);
                } else {
                  setPwCheck(false);
                }
              }}
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'pw_check_1'} style={{display: pwCheck ? 'none' : 'list-item'}}>비밀번호가 일치하지 않습니다.</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이메일</p>
          <div className={Styles.Right}>
            <input 
              placeholder='ABC123@pusan.ac.kr'
              className={Styles.InputBox} 
              id='email'
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
            <button className={Styles.BlueButton}>중복확인</button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li id={'email_check_1'} style={{display: emailCheck ? 'none' : 'list-item'}}>부산대학교 이메일 'ID@pusan.ac.kr'만 허용합니다.</li>
              <li id={'email_check_2'} style={{display: emailUnduplicated ? 'none' : 'list-item'}}>중복 확인을 눌러주세요.</li>
            </ul>
          </div>
        </div>
        
        <button className={Styles.BlueButton} onClick={submitHandler}>가입하기</button>
        
      </div>
    </div>
  );
}