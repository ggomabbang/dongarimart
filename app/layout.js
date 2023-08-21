'use client';

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html>
        <body className={inter.className}>
          <div className='Navbar'>
            <button onClick={()=>{location.replace('http://localhost:3000/')}} style={{textDecorationLine:'none', border:'none', background:'transparent'}} className='Title_color'>   WAVE</button>
            <button onClick={()=>{location.replace('http://localhost:3000/signup')}} className='NavBtn' style={{ textDecorationLine:'none', marginLeft:'67%'}}>SIGN IN</button>
            <button onClick={()=>{location.replace('http://localhost:3000/contact')}} className='NavBtn' style={{textDecorationLine:'none'}}>CONTACT</button>
          </div>
          {children}
        </body>
    </html>
  )
}