'use client'

import './globals.css'
import Link from "next/link"

export default function Home() {
  return (
    <div className='SideDiv' style={{paddingTop:'10%'}}>
    <Link href={"/find"}>
      <button className='Find_Btn'>동아리 찾아보기</button>
    </Link>
    <div className='InnerDiv' style={{paddingTop:'13%'}}>
      <Link href={"/recruit"}>
        <button className='Recruit_Btn'>모집하기</button>
      </Link>
      <div><h4></h4></div>
      <Link href={"/upload"}>
        <button className='Register_Btn'>등록/관리</button>
      </Link>
    </div>
  </div>
  )
}
