'use client'

import Styles from './Navbar.module.css';
import Link from 'next/link';

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import useDeviceSize from '../hooks/useDeviceSize';

export default function navbar() {
  const { isDesktop } = useDeviceSize();
  const [mobile, setMobile] = useState(true);
  const { data: session, status } = useSession();

  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session?.error]);
  
  useEffect(() => {
    if (isDesktop) setMobile(false);
    else setMobile(true);
  }, [isDesktop])

  if (!mobile) {
    return (
      <div className={Styles.Navbar}>
        <div className={Styles.NavMain}>
          <Link href={'/'} className={Styles.Title}>
            <img src='/Main_Logo.png'/>
            <h1>부산대점</h1>
          </Link>
          { 
            status === "authenticated" ?
            <div className={Styles.Menu}>
              {
                session.userRole === 'admin' ?
                <Link href={'/admin'} className={Styles.NavButton}>
                  관리자
                </Link> : null
              }
              <Link href={'/contact'} className={Styles.NavButton}>
                CONTACT
              </Link>
              <Link href={'/my'} className={Styles.NavButton}>
                MY
              </Link>
              <Link href={'/'} className={Styles.NavButton} onClick={() => signOut()}>
                로그아웃
              </Link>
            </div>
            :
            <div className={Styles.Menu}>
              <Link href={'/contact'} className={Styles.NavButton}>
                CONTACT
              </Link>
              <Link href={'/login'} className={Styles.NavButton}>
                로그인
              </Link>
            </div>
          }
        </div>
      </div>
    )
  }
  else {
    return (
      <div className={Styles.Navbar}>
        <div className={Styles.NavMain}>
          <button className={Styles.MenuButton} onClick={()=>setMenu(!menu)}>
            ≡
          </button>
          <Link href={'/'} className={Styles.Title}>
            <img src='/Main_Logo_Small.png'/>
            <h1>부산대점</h1>
          </Link>
          {
            status === 'authenticated' ?
              <Link href={'/my'} className={Styles.NavButton}>
                MY
              </Link> : null
          }
          {
            status === 'unauthenticated' ?
              <Link href={'/login'} className={Styles.NavButton}>
                로그인
              </Link> : null
          }
          {
            status === 'loading' ?
              <div className={Styles.NavButton}/> : null
          }
        </div>
        {
          menu ?
            status === "authenticated" ?
              <div className={Styles.NavPlus}>
                {
                  session.userRole === 'admin' ?
                  <Link href={'/admin'} className={Styles.NavPlusButton}>
                    관리자
                  </Link> : null
                }
                <Link href={'/contact'} className={Styles.NavPlusButton}>
                  CONTACT
                </Link>
                <Link href={'/'} className={Styles.NavPlusButton} onClick={() => signOut()}>
                  로그아웃
                </Link>
              </div> 
              :
              <div className={Styles.NavPlus}>
                <Link href={'/contact'} className={Styles.NavPlusButton}>
                  CONTACT
                </Link>
              </div> 
            : null
        }
        
      </div>
    )
  }
  
}