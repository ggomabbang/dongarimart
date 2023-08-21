'use client';

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html>
        <body className={inter.className}>
          <div className='Navbar'>
            <img onClick={()=>{location.replace('http://localhost:3000/')}} src='/WAVE.png' style={{height:'100px'}}></img>
            <button id='logged' onClick={()=>{location.replace('http://localhost:3000/signup')}} className='NavBtn' style={{ textDecorationLine:'none', marginLeft:'70%', marginTop:'-3%'}}>SIGN IN</button>
            <button onClick={()=>{location.replace('http://localhost:3000/contact')}} className='NavBtn' style={{textDecorationLine:'none', marginLeft:'90%', marginTop:'-3%'}}>CONTACT</button>
          </div>
          {children}
        </body>
    </html>
  )
}