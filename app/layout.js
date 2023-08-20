'use client';

import Link from "next/link"
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html>
        <body className={inter.className}>
          <div className='Navbar'>
            <Link href={"/"} onClick={()=>{location.replace('http://localhost:3000/')}} style={{textDecorationLine:'none'}} className='Title_color'>   WAVE</Link>
            <Link href={"/signup"} onClick={()=>{location.replace('http://localhost:3000/signup')}} className='NavBtn' style={{ textDecorationLine:'none'}}>LOGIN</Link>
            <Link href={"/contact"} onClick={()=>{location.replace('http://localhost:3000/contact')}} className='NavBtn' style={{textDecorationLine:'none'}}>CONTACT</Link>
          </div>
          {children}
        </body>
    </html>
  )
}