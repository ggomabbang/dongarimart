'use client'

import './globals.css'
import Link from "next/link"

export default function Home() {
  return (
    <div className='SideDiv' style={{paddingTop:'22%'}}>
    <button onClick={()=>{location.replace('http://localhost:3000/find')}} className='Find_Btn'
    style={{marginLeft:'25%'}}>동아리 찾아보기</button>
    <div className='InnerDiv' style={{paddingTop:'34%', marginLeft:'65%'}}>
      <button onClick={()=>{location.replace('http://localhost:3000/rcr')}} className='Recruit_Btn'>모집하기</button>
      <div><h4></h4></div>
      <button className='Register_Btn' onClick={()=>{location.replace('http://localhost:3000/upload')}}>등록/관리</button>
    </div>
  </div>
  )
}


