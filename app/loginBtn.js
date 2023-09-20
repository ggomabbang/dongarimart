'use client'

import Link from "next/link";
import Styles from "./layout.module.css";
import { useSession } from "next-auth/react";

export default function loginBtn() {
  const { data: session, status } = useSession()
  console.log(session);
  console.log(status);

  if (status === "authenticated") {
    return (
      <Link href={'/my'}>
        <button className={Styles.NavBtn}>
          MY
        </button>
      </Link>
    )
  } else {
    return (
      <Link href={'/login'}>
        <button id='logged' className={Styles.NavBtn}>
          SIGN IN
        </button>
      </Link>
    )
  }

}