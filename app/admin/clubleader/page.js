'use client';

import { useEffect, useState } from 'react';
import Styles from './recruit.module.css';
import { useRouter } from 'next/navigation';

export default function clubLeader() {
  const router = useRouter();

  const [ID, setID] = useState('');
  const [name, setName] = useState('');

  const submitHandler = async (e) => {
    if (ID === '') return alert("ID가 필요합니다.");
    if (name === '') return alert("닉네임이 필요합니다.");
    
    const res = await fetch(`/api/admin/clubs/`+ID, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username: name
      }
    });

    if (res.status == 200) {
      return router.push('/admin');
    }
    else if (res.status == 204) {
      alert('없는 동아리입니다.');
      return router.push('/');
    }
    else if (res.status == 400) {
      alert('잘못된 값이 입력되었습니다.');
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
      <h1 className={Styles.PageTitle}>동아리 권한 이전하기 (관리자)</h1>
      <div className={Styles.Input}>
        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 ID</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='이전할 동아리 ID'
              value={ID}
              onChange={(e) => setID(e.target.value)}
            />
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>닉네임</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='이전 받을 회원의 닉네임'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </label>

        <button className={Styles.UploadButton} style={{color:'orange'}} onClick={submitHandler}>
          이전하기
        </button>

      </div>
    </div>
  )
}