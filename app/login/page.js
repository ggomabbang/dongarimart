'use client';

import Styles from './Login.module.css'
import Link from "next/link"
import { useRef } from 'react';
import { signIn, useSession } from "next-auth/react";

export default function home() {
  const emailRef = useRef(null);

  const passwordRef = useRef(null);

  const { data: session } = useSession();
  return (
    <div className={Styles.Panel}>
      <form className={Styles.LoginContent}>
        <div className={Styles.Logo}>
          <img src='/Main_Logo.png'/>
          <div>부산대점</div>
        </div>
        <div className={Styles.LoginInput}>
          <input 
            className={Styles.InputBox}
            ref={emailRef}
            placeholder='XXX@pusan.ac.kr'
          />
          <input
            className={Styles.InputBox}
            ref={passwordRef}
            placeholder='Password'
            type='password'
          />
          <div className={Styles.Bottom}>
            <Link href={'/login/signup'}>가입하기</Link>
            <Link href={'/login/findpw'}>비밀번호 찾기</Link>
          </div>
        </div>
        <input
          type='submit'
          value='로그인'
          className={Styles.LoginBtn}
          onClick={(e)=>{
            e.preventDefault()
            if (!emailRef.current || !passwordRef.current) 
              return alert("로그인 양식을 다시 확인해 주세요.");
            if (emailRef.current.value == '')
              return alert("이메일을 입력해 주세요.");
            if (passwordRef.current.value == '')
              return alert("비밀번호를 입력해 주세요.");
            signIn('credentials', {
              email: emailRef.current.value,
              password: passwordRef.current.value,
            });
          }}
        />
      </form>
    </div>
  )
}