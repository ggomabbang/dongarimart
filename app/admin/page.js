'use client';

import Styles from './admin.module.css';
import { useRouter } from 'next/navigation';

export default function admin() {
  const router = useRouter();

  return (
    <div className={Styles.Panel}>
      <h1 className={Styles.PageTitle}>관리자</h1>
      <div className={Styles.Input}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>공지사항</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton} onClick={(e) => router.push('admin/notice')}>
              공지사항 등록하기
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}