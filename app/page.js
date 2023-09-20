import Styles from './page.module.css'
import Link from "next/link"

import AD_Banner from './AD_Banner';
import Notice from './notice/notice';

export default function Home() {
  return (
    <div className={Styles.Content}>
      <AD_Banner/>

      <div className={Styles.MainButton}>
        <Link href={'/find'} className={Styles.Find_Btn}>
          <button>
            찾아보기
          </button>
        </Link>
        <div className={Styles.InnerDiv}>
          <Link href={'/register'} className={Styles.Register_Btn}>
            <button>
              등록/관리
            </button>
          </Link>
          <Link href={'/recruit'} className={Styles.Recruit_Btn}>
            <button>
              모집하기
            </button>
          </Link>
        </div>
      </div>
      
      <Notice/>
    </div>
  );
}