'use client';

import Styles from "./layout.module.css";
import { Inter } from 'next/font/google';
import Link from "next/link";


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html>
        <body className={inter.className}>
          <div className={Styles.Navbar}>
            <Link href={'/'} className={Styles.Title}>
              <img src='/WAVE.png'/>
            </Link>
            <div className={Styles.Menu}>
              <Link href={'/login'}>
                <button id='logged' className={Styles.NavBtn}>
                  SIGN IN
                </button>
              </Link>
              <Link href={'/contact'}>
                <button className={Styles.NavBtn}>
                  CONTACT
                </button>
              </Link>
            </div>
          </div>
          {children}
        </body>
    </html>
  )
}