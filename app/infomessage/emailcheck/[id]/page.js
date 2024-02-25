'use client'

import Styles from '@/app/infomessage/Info.module.css';
import { useRouter } from 'next/navigation';

export default function signUp({params}) {
  const router = useRouter();

  const submitHandler = async (e) => {
    return router.push('/');
  }

  return (
    <div className={Styles.Container}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
            {`${params.id}@pusan.ac.kr로 이메일이 전송되었습니다! 메일함을 확인해주세요!`}
        </div>
        
        <button className={Styles.BlueButton} onClick={submitHandler}>메인페이지로 이동하기</button>
      </div>
    </div>
  );
}