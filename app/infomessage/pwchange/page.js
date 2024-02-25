'use client'

import Styles from '@/app/infomessage/Info.module.css';
import { useRouter } from 'next/navigation';

export default function pwChange() {
  const router = useRouter();

  const submitHandler = async (e) => {
    return router.push('/login');
  }

  return (
    <div className={Styles.Container}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
            비밀번호 변경이 완료되었습니다. 로그인을 다시 진행해주세요!
        </div>
        
        <button className={Styles.BlueButton} onClick={submitHandler}>로그인 하러 가기</button>
      </div>
    </div>
  );
}