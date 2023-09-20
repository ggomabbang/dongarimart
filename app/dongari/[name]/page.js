import Styles from './dongari.module.css';
import Link from 'next/link';

export default function Dongari() {
  const title = '동아리 C';
  const subTitle = '야! 구하자';
  const shortText = 'OO학과 야구동아리 동아리 C입니다. 같이 하실분 구해여 ㅎㅎ 언능들어오이소';
  const tag = ['스포츠', '야구'];
  const period = '23/10/30';
  const people = '타자 - 3명 포수 - 1명 외야 - 2명';

  const contents = '뭐 여러명 모집 하는데 알아서 신청하십쇼들';

  return (
    <div className={Styles.Container}>
      <div className={Styles.Top}>
        <h1>{title}</h1>
        <h3>{subTitle}</h3>
      </div>
      <div className={Styles.Middle}>
        <div className={Styles.ImageBox}>
          IMAGE<img />
        </div>
        <div className={Styles.MiddleRight}>
          <p className={Styles.ShortText}>{shortText}</p>
          <div className={Styles.InnerMiddle}>
            <div className={Styles.TagBox}>
              {tag.map((name, index)=>{
                return (
                  <button id={'tag'+index}>{name}</button>
                )
              })}
            </div>
            <Link href={'https://plato.pusan.ac.kr/'}>
              <button className={Styles.BlueButton}>홈페이지</button>
            </Link>
          </div>
          <div className={Styles.RecruitBox}>
            <div className={Styles.RecruitInner}>
              <button>모집기간</button>
              <p>{period}</p>
            </div>
            <div className={Styles.RecruitInner}>
              <button>세부인원</button>
              <p>{people}</p>
            </div>
          </div>
        </div>
      </div>
      <p className={Styles.Contents}>
        {contents}
      </p>
      <button className={Styles.BlueButton}>신청하기</button>
    </div>
  )
}