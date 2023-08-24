'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html>
        <body className={inter.className}>
          <div className='Navbar'>
            <Link href={'/'}>
              <img src='/WAVE.png' style={{minHeight:'9vh', maxHeight:'9vh'}}/>
            </Link>
            <Link href={'/login'}>
              <button id='logged' className='NavBtn' style={{ textDecorationLine:'none', marginLeft:'70%', marginTop:'-3.5%'}}>
                SIGN IN
              </button>
            </Link>
            <Link href={'/contact'}>
              <button className='NavBtn' style={{textDecorationLine:'none', marginLeft:'82%', marginTop:'-3.5%'}}>
                CONTACT
              </button>
            </Link>
          </div>
          {children}
        </body>
    </html>
  )
}