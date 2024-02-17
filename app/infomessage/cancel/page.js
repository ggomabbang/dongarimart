'use client'

import Styles from '../Info.module.css';
import { useRouter } from 'next/navigation';

export default function pwChange() {
  const router = useRouter();

  const submitHandler = async (e) => {
    return router.push('/login');
  }

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
            회원탈퇴가 완료되었습니다!
        </div>
        
        <button className={Styles.BlueButton} onClick={submitHandler}>로그인 하러 가기</button>
      </div>
    </div>
  );
}