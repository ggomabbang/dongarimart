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
                Club.tags.map((tagObj)=>{
                  return (
                    <button key={tagObj.tagList.id}>
                      {tagObj.tagList.tagName}
                    </button>
                  )
                })
              }
              <button>
                {Club.classification}
              </button>
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
              <p>{Club.post.recruit.recruitStart}~{Club.post.recruit.recruitEnd}</p>
            </div>
            <div className={Styles.RecruitInner}>
              <button>세부인원</button>
              <p>{Club.post.recruit.recruitTarget}</p>
            </div>
          </div>
        </div>
      </div>
      <p className={Styles.Contents}>
        {Club.post.content}
      </p>
      <button className={Styles.BlueButton}>신청하기</button>
    </div>
  )
}