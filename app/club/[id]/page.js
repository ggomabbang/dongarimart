'use client'

import Styles from './club.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Club({ params }) {
  const clubid = params.id;
  const [Club, setClub] = useState({});

  const GetClub = async (id) => {
    const URL = 'http://localhost:3000';
    const rows = await fetch(URL+'/api/clubs/'+id, {
      method: "GET"
    });
    const jsonData = await rows.json();
    setClub(jsonData[0]);
    console.log(Club);
  }

  useEffect(() => {
    GetClub(clubid);
  }, []);
  
  const tag = ['스포츠', '야구'];

  const contents = '뭐 여러명 모집 하는데 알아서 신청하십쇼들';

  return (
    <div className={Styles.Container}>
      <div className={Styles.Top}>
        <h1>{Club.clubName}</h1>
        <h3>{Club.oneLine}</h3>
      </div>
      <div className={Styles.Middle}>
        <div className={Styles.ImageBox}>
          IMAGE<img />
        </div>
        <div className={Styles.MiddleRight}>
          <p className={Styles.ShortText}>{Club.short}</p>
          <div className={Styles.InnerMiddle}>
            <div className={Styles.TagBox}>
              {tag.map((name, index)=>{
                return (
                  <button id={'tag'+index} key={index}>{name}</button>
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
              <p>{Club.recruitPeriod}</p>
            </div>
            <div className={Styles.RecruitInner}>
              <button>세부인원</button>
              <p>{Club.recruitTarget}</p>
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