'use client'

import Styles from './SignUp.module.css';
import { useState, useEffect } from 'react';

export default function SignUp() {
  const [pwStyle, setPwStyle] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [pwCheck, setPwCheck] = useState(false);

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
          <text className={Styles.Left}>ID</text>
          <div className={Styles.Right}>
            <input 
              placeholder='ID'
              className={Styles.InputBox} 
              id='ID_box'
            />
            <button className={Styles.BlueButton}>중복확인</button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <text className={Styles.Left}>비밀번호</text>
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
          <text className={Styles.Left}></text>
          <div className={Styles.Right}>
            <ul>
              <li id={'pw_1'} style={{display: pwStyle[1] ? 'none' : 'list-item'}}>8 ~ 22자리 이내로 입력해주세요.</li>
              <li id={'pw_2'} style={{display: pwStyle[2] ? 'none' : 'list-item'}}>대문자와 소문자를 같이 포함해주세요.</li>
              <li id={'pw_3'} style={{display: pwStyle[3] ? 'none' : 'list-item'}}>특수문자를 포함해주세요. <br/>허용 특수문자: `~!@#$%^&*|'";:₩\?-_+=</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <text className={Styles.Left}>비밀번호<br/>확인</text>
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
          <text className={Styles.Left}></text>
          <div className={Styles.Right}>
            <ul>
              <li id={'pw_check_1'} style={{display: pwCheck ? 'none' : 'list-item'}}>비밀번호가 일치하지 않습니다.</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <text className={Styles.Left}>이메일</text>
          <div className={Styles.Right}>
            <input 
              placeholder='ABC123@abc.com'
              className={Styles.InputBox} 
              id='email'
            />
          </div>
        </div>
        
        <button className={Styles.BlueButton}>가입하기</button>
        
      </div>
    </div>
  );
}