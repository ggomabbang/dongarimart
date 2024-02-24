'use client'

import Styles from '@/app/component/inputPanel.module.css'
import { signOut } from "next-auth/react"
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function password() {
  const router = useRouter();
  const nowPw = useRef(null);

  const submitHandler = async (e) => {
    if (nowPw.current.value.length < 1) return alert('현재 비밀번호를 입력해주세요.');
    
    const res = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: nowPw.current.value,
      })
    });

    if (res.status == 200) {
      return signOut({ callbackUrl: '/infomessage/cancel'});
    } else if (res.status == 400) {
      return alert('현재 비밀번호가 일치하지 않습니다.');
    } else if (res.status == 401) {
      alert('로그인 후 다시 진행해주세요');
      return router.push('/login');
    }
  }

  return (
    <div className={Styles.Container}>
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
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li>탈퇴시 연관된 동아리와 게시글은 삭제되지 않습니다.</li>
              <li>동아리 편집 권한을 잃게됩니다.</li>
              <li>이 작업은 돌이킬 수 없습니다.</li>
            </ul>
          </div>
        </div>
        
        <button className={Styles.BlueButton} onClick={submitHandler}>회원 탈퇴</button>

      </div>
    </div>
  )
}