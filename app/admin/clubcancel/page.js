'use client';

import { useEffect, useState } from 'react';
import Styles from '@/app/component/inputPanel.module.css';
import { useRouter } from 'next/navigation';

export default function clubCancel() {
  const router = useRouter();

  const [ID, setID] = useState('');
  const [content, setContent] = useState('');

  const submitHandler = async (e) => {
    if (ID === '') return alert("ID가 필요합니다.");
    
    const res = await fetch(`/api/admin/clubs/`+ID, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (res.status == 200) {
      return router.push('/admin');
    }
    else if (res.status == 400) {
      alert('요청 오류.');
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
  }

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 삭제하기 (관리자)</h1>
      <div className={Styles.Input}>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 ID</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='삭제할 동아리 ID'
              value={ID}
              onChange={(e) => setID(e.target.value)}
            />
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>삭제 사유</p>
          <div className={Styles.Right}>
            <div className={Styles.InputWithCount}>
              <textarea 
                className={Styles.LargeInputBox}
                placeholder='(미지원 기능) 이메일로 전송하는 목적에 쓰일 예정'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                readOnly
              />
            </div>
          </div>
        </label>

        <button className={Styles.BlueButton} style={{backgroundColor:'red'}} onClick={submitHandler}>
          삭제
        </button>

      </div>
    </div>
  )
}