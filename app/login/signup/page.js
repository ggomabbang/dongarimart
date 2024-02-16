'use client'

import Styles from './SignUp.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function signUp() {
  const router = useRouter();
  const [nameCheck, setNameCheck] = useState(false);
  const [nameUnduplicated, setNameUnduplicated] = useState(false);
  const [pwStyle, setPwStyle] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [pwCheck, setPwCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailUnduplicated, setEmailUnduplicated] = useState(false);

  const submitHandler = async (e) => {
    const checks = [nameCheck, nameUnduplicated, pwCheck, emailCheck, emailUnduplicated];
    for (const check in checks) {
      if (!checks[check]) return alert('가입 양식이 잘못되었습니다.');
    }
    for (const check in pwStyle) {
      if (!pwStyle[check]) return alert('가입 양식이 잘못되었습니다.');
    }

    const username = document.getElementById('ID_box').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email
      })
    });
    if (res.status == 201) {
      const emailRes = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        })
      });
      if (emailRes.status == 204) {
        const id = email.split('@')[0];
        return router.push(`/login/emailcheck/${id}`);
      } else if (emailRes.status == 400) {
        alert('MY 페이지에서 이메일 확인을 다시 진행해주세요');
        return router.push('/');
      } else {
        alert('Error');
        return router.push('/');
      }
    } else if (res.status == 400) {
      alert('요청 오류');
      return router.push('/');
    } else if (res.status == 403) {
      alert('가입을 다시 진행해주세요.');
      return router.push('/');
    } else {
      alert('Error');
      return router.push('/');
    }
  }
  return (
    <div className={Styles.Panel}>
      <div className={Styles.Top}>
        <h1 className={Styles.Title}>회원가입</h1>
      </div>

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
                setNameUnduplicated(false);
              }}
            />
            <button
              className={Styles.BlueButton}
              disabled={nameCheck ? false : true}
              style={nameCheck ? {} : {backgroundColor: 'gray'}}
              onClick={ async (e) => {
                const username = document.getElementById('ID_box').value;
                const params = new URLSearchParams();
                params.append('username', username);
                const res = await fetch('/api/users?' + params.toString(), {
                  method: 'GET'
                });
                if (res.status == 200) {
                  const body = await res.json();
                  if (body.exist == 'true') {
                    alert('중복된 닉네임이 존재합니다.');
                    setNameUnduplicated(false);
                  }
                  else if (body.exist == 'false') {
                    setNameUnduplicated(true);
                  }
                }
              }}
            >
              중복확인
            </button>
          </div>
        </div>
        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li style={{display: nameCheck ? 'none' : 'list-item'}}>닉네임을 입력해 주세요.</li>
              <li style={{display: nameUnduplicated ? 'none' : 'list-item'}}>중복 확인이 필요합니다.</li>
              <li style={{display: !nameUnduplicated ? 'none' : 'list-item', color: 'green'}}>중복 확인이 완료되었습니다.</li>
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
                document.getElementById('password_check').value = '';
                setPwCheck(false);
                
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

                if (/[`~!@#$%^&*|'";:₩\\?\-_+=]/g.test(pw) && !/[^\w`~!@#$%^&*|'";:₩\\?\-_+=]/g.test(pw)) {
                  newStyle[3] = true;
                } else {
                  newStyle[3] = false;
                }

                if (/[0-9]/g.test(pw)) {
                  newStyle[4] = true;
                } else {
                  newStyle[4] = false;
                }

                setPwStyle({...newStyle});
              }}
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li style={{display: pwStyle[1] ? 'none' : 'list-item'}}>8 ~ 22자리 이내로 입력해주세요.</li>
              <li style={{display: pwStyle[2] ? 'none' : 'list-item'}}>대문자와 소문자를 같이 포함해주세요.</li>
              <li style={{display: pwStyle[3] ? 'none' : 'list-item'}}>특수문자를 포함해주세요. <br/>허용 특수문자: `~!@#$%^&*|'";:₩\?-_+=</li>
              <li style={{display: pwStyle[4] ? 'none' : 'list-item'}}>숫자를 포함해주세요.</li>
              <li style={{display: Object.values(pwStyle).includes(false)? 'none' : 'list-item', color: 'green'}}>안전한 비밀번호입니다.</li>
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
              <li style={{display: pwCheck ? 'none' : 'list-item'}}>비밀번호가 일치하지 않습니다.</li>
              <li style={{display: !pwCheck ? 'none' : 'list-item', color: 'green'}}>비밀번호가 일치합니다.</li>
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
                setEmailUnduplicated(false);
              }}  
            />
            <button
              className={Styles.BlueButton}
              disabled={emailCheck ? false : true}
              style={emailCheck ? {} : {backgroundColor: 'gray'}}
              onClick={ async (e) => {
                const email = document.getElementById('email').value;
                const params = new URLSearchParams();
                params.append('email', email);
                const res = await fetch('/api/users?' + params.toString(), {
                  method: 'GET'
                });
                if (res.status == 200) {
                  const body = await res.json();
                  if (body.exist == 'true') {
                    alert('중복된 이메일이 존재합니다.');
                    setEmailUnduplicated(false);
                  }
                  else if (body.exist == 'false') {
                    setEmailUnduplicated(true);
                  }
                }
              }}
            >
              중복확인
            </button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              <li style={{display: emailCheck ? 'none' : 'list-item'}}>부산대학교 이메일 'ID@pusan.ac.kr'만 허용합니다.</li>
              <li style={{display: emailUnduplicated ? 'none' : 'list-item'}}>중복 확인이 필요합니다.</li>
              <li style={{display: !emailUnduplicated ? 'none' : 'list-item', color: 'green'}}>중복 확인이 완료되었습니다.</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이용정보</p>
          <div className={Styles.Right}>
            - 입력하신 정보는 서비스 제공 목적으로만 사용됩니다.<br/>
            - 입력하신 정보는 회원 탈퇴시까지 유지 됩니다.<br/>
            - 가입 후 비밀번호 변경이 가능합니다.
          </div>
        </div>
        
        <button className={Styles.BlueButton} onClick={submitHandler}>가입하기</button>
      </div>
    </div>
  );
}