'use client'

import Styles from './club.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Club({ params }) {
  const clubid = params.id;
  const [Club, setClub] = useState({
    id: 0,
    clubName: "",
    department: "",
    oneLine: "",
    short: "",
    isRecruiting: false,
    tags: [],
  });

  const GetClub = async (id) => {
    const URL = 'http://localhost:3000';
    const rows = await fetch(URL+'/api/clubs/'+id, {
      method: "GET"
    });
    const jsonData = await rows.json();
    setClub(jsonData);
    console.log(jsonData);
  }

  useEffect(() => {
    GetClub(clubid);
  }, []);

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
              {
                Club.tags.map((tag)=>{
                  return (
                    <button id={'tag'+tag.tag.id} key={tag.tag.id}>
                      {tag.tag.tagName}
                    </button>
                  )
                })
              }
            </div>
            {
              Club.pageURL == null ?
                <button className={Styles.BlueButton}>홈페이지 없음</button>
              :
                <Link href={Club.pageURL}>
                  <button className={Styles.BlueButton}>홈페이지</button>
                </Link>
            }
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