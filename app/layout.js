import Styles from "./layout.module.css";
import './global.css';
import { Inter } from 'next/font/google';
import Link from "next/link";

import AuthSession from "./AuthSession.jsx";
import Menu from "./Menu";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "WAVE",
  description: "우리들의 첫 물결",
};

export default function rootLayout({ children }) {

  return (
    <html lang="en">
        <body className={inter.className}>
          <AuthSession>
            <div className={Styles.Navbar}>
              <Link href={'/'} className={Styles.Title}>
                <img src='/Main_Logo.png'/>
                <div>부산대점</div>
              </Link>
              <Menu/>
            </div>
            {children}
          </AuthSession>
        </body>
    </html>
  )
}