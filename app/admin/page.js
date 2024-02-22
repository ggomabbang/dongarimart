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

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 권한</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton} style={{backgroundColor:'orange'}} onClick={(e) => router.push('admin/clubleader')}>
              동아리 소유권(편집권) 이전하기
            </button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 삭제</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton} style={{backgroundColor:'red'}} onClick={(e) => router.push('admin/clubcancel')}>
              동아리 삭제하기
            </button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>글 삭제</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton} style={{backgroundColor:'red'}} onClick={(e) => router.push('admin/postcancel')}>
              글(공지 포함) 삭제하기
            </button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집글 삭제</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton} style={{backgroundColor:'red'}} onClick={(e) => router.push('admin/recruitcancel')}>
              모집글 삭제하기
            </button>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>회원 삭제</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton} style={{backgroundColor:'red'}} onClick={(e) => router.push('admin/usercancel')}>
              회원정보 삭제하기
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}