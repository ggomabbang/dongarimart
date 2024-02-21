'use client';

import { useEffect, useState } from 'react';
import Styles from './recruit.module.css';
import { useRouter } from 'next/navigation';

export default function userCancel() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const submitHandler = async (e) => {
    if (name === '') return alert("닉네임이 필요합니다.");
    
    const res = await fetch(`/api/admin/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name
      })
    });

    if (res.status == 200) {
      return router.push('/admin');
    }
    else if (res.status == 204) {
      alert('없는 회원입니다');
      return router.push('/');
    }
    else if (res.status == 400) {
      alert('ID를 숫자로 입력해주세요');
      return router.push('/');
    }
    else if (res.status == 401) {
      alert('로그인 후 다시 진행하여 주세요.');
      return router.push('/login');
    }
    else if (res.status == 403) {
      alert('권한이 없습니다.');
      return router.push('/')
    }
    else {
      return alert('500 오류');
    }
  }

  return (
    <div className={Styles.Panel}>
      <h1 className={Styles.PageTitle}>회원정보 삭제하기 (관리자)</h1>
      <div className={Styles.Input}>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>닉네임</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='삭제할 회원의 닉네임'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>삭제 사유</p>
          <div className={Styles.Right}>
            <textarea 
              className={Styles.LargeInputBox}
              placeholder='(미지원 기능) 이메일로 전송하는 목적에 쓰일 예정'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly
            />
          </div>
        </label>

        <button className={Styles.UploadButton} style={{color:'red'}} onClick={submitHandler}>
          삭제
        </button>

      </div>
    </div>
  )
}