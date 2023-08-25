import './globals.css'
import Link from "next/link"

import AD_Banner from './AD_Banner';

export default function Home() {
  return (
    <div style={{marginTop:'2%'}}>
      <AD_Banner/>
      <div className='SideDiv' style={{marginTop:'-70%'}}>
        <Link href={'/find'}>
          <button className='Find_Btn' style={{marginLeft:'28%', marginTop:'25%'}}>
            동아리 찾아보기
          </button>
        </Link>
        <div className='InnerDiv' style={{marginTop:'17%', marginLeft:'67%'}}>
          <Link href={'/recruit'}>
            <button className='Recruit_Btn'>
              모집하기
            </button>
          </Link>
          <div><h4></h4></div>
          <Link href={'/register'}>
            <button className='Register_Btn'>등록/관리</button>
          </Link>
        </div>
      </div>
      <div className='SettingPanel' style={{marginLeft:'20%', marginTop:'-22%'}}></div>
    </div>
  );
}