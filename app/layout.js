import Styles from "./layout.module.css";
import './global.css';
import { Inter } from 'next/font/google';
import Link from "next/link";

import AuthSession from "./AuthSession.jsx";
import LoginBtn from "./loginBtn";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "WAVE",
  description: "우리들의 첫 물결",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
        <body className={inter.className}>
          <AuthSession>
            <div className={Styles.Navbar}>
              <Link href={'/'} className={Styles.Title}>
                <img src='/WAVE.png'/>
              </Link>
              <div className={Styles.Menu}>
                <Link href={'/contact'}>
                  <button className={Styles.NavBtn}>
                    CONTACT
                  </button>
                </Link>
                <LoginBtn/>
              </div>
            </div>
            {children}
          </AuthSession>
        </body>
    </html>
  )
}