import './globals.css'
import Link from "next/link"

import AD_Banner from './AD_Banner';

export default function Home() {
  return (
    <div className='Content'>
      <AD_Banner/>

      <div className='MainButton'>
        <Link href={'/find'} className='Find_Btn'>
          <button>
            찾아보기
          </button>
        </Link>
        <div className='InnerDiv'>
          <Link href={'/register'} className='Register_Btn'>
            <button>
              등록/관리
            </button>
          </Link>
          <Link href={'/recruit'} className='Recruit_Btn'>
            <button>
              모집하기
            </button>
          </Link>
        </div>
      </div>
      
      <div className='SettingPanel'></div>
    </div>
  );
}