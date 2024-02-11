import Styles from './oneArticle.module.css';
import Link from 'next/link';

export default function oneArticle() {
  const title = '23년 3분기 악성 이용자 제제내역';
  const date = '23/08/22';
  const contents = '뭔가 거창한 글이 여기에 있음. 사실 이용자가 없어서 제제당한 사람이 없다~람쥐~';

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>공지사항 📢</h1>
      <div className={Styles.Panel}>
        <div className={Styles.Top}>
          <Link href={'/notice'}>
            <p className={Styles.GoBack}>&lt; 뒤로가기</p>
          </Link>
          <h1 className={Styles.Title}>{title}</h1>
          <h4 className={Styles.Date}>{date}</h4>
          <div className={Styles.line}/>
        </div>
        <div className={Styles.Bottom}>
          <p className={Styles.Contents}>{contents}</p>
        </div>
      </div>
      
    </div>
  )
}