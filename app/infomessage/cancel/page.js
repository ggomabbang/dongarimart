'use client'

import Styles from '@/app/infomessage/Info.module.css';
import { useRouter } from 'next/navigation';

export default function pwChange() {
  const router = useRouter();

  return (
    <div className={Styles.Container}>
      <div className={Styles.Input}>
        <div className={Styles.HorizonBox}>
            회원탈퇴가 완료되었습니다!
        </div>
      </div>
    </div>
  );
}