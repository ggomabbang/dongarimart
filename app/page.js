'use client'

import Styles from './page.module.css'
import Link from "next/link"

import AD_Banner from './AD_Banner';
import Notice from './notice/notice';

import { useSession } from "next-auth/react"

export default function Home() {
  const { status } = useSession();
  return (
    <div className={Styles.Content}>
      <AD_Banner/>

      <div className={Styles.MainButton}>
        <Link href={'/find'} className={Styles.Find_Btn}>
          <button>
            찾아보기
          </button>
        </Link>
        {
          status === 'authenticated' ?
          <div className={Styles.InnerDiv}>
            <Link href={'/register'} className={Styles.Register_Btn}>
              <button>
                등록/관리
              </button>
            </Link>
            <Link href={'/recruit'} className={Styles.Recruit_Btn}>
              <button>
                모집하기
              </button>
            </Link>
          </div>
          :
          <div className={Styles.InnerDiv}>
            <Link href={'/login/signup'} className={Styles.Register_Btn}>
              <button>
                회원가입
              </button>
            </Link>
            <Link href={'/login'} className={Styles.Recruit_Btn}>
              <button>
                로그인
              </button>
            </Link>
          </div>
        }
        
      </div>
      
      <Notice/>
    </div>
  );
}