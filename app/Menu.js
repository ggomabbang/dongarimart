'use client'

import Link from "next/link";
import Styles from "./layout.module.css";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function loginBtn() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session?.error]);

  if (status === "authenticated") {
    return (
      <div className={Styles.Menu}>
        {
          session.userRole === 'admin' ?
          <Link href={'/admin'}>
            <button className={Styles.NavBtn}>
              관리자
            </button>
          </Link> : null
        }
        <Link href={'/contact'}>
          <button className={Styles.NavBtn}>
            CONTACT
          </button>
        </Link>
        <Link href={'/my'}>
          <button className={Styles.NavBtn}>
            MY
          </button>
        </Link>
        <Link href={'/'}>
          <button className={Styles.NavBtn} onClick={() => signOut()}>
            SIGN OUT
          </button>
        </Link>
      </div>
    )
  } else if (status === "unauthenticated") {
    return (
      <div className={Styles.Menu}>
        <Link href={'/contact'}>
          <button className={Styles.NavBtn}>
            CONTACT
          </button>
        </Link>
        <Link href={'/login'}>
          <button id='logged' className={Styles.NavBtn}>
            SIGN IN
          </button>
        </Link>
      </div>
    )
  }

}