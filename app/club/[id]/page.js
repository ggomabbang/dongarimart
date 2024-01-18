'use client'

import Styles from './club.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Club({ params }) {
  const clubid = params.id;
  const [Club, setClub] = useState({
    id: 0,
    clubName: "로딩 중",
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

  function getDate(date) {
    const today = new Date(date);
  
    const year = today.getFullYear(); // 2023
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 06
    const day = today.getDate().toString().padStart(2, '0'); // 18
  
    const dateString = year + '-' + month + '-' + day; // 2023-06-18
  
    return dateString;
  }

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
          {
            Club.isRecruiting ?
            <div className={Styles.RecruitBox}>
              <div className={Styles.RecruitInner}>
                <button>모집기간</button>
                <p>{getDate(Club.post.recruit.recruitStart)} ~ {getDate(Club.post.recruit.recruitEnd)}</p>
              </div>
              <div className={Styles.RecruitInner}>
                <button>세부인원</button>
                <div>
                  {
                    JSON.parse(Club.post.recruit.recruitTarget).map((target, index) => {
                      return (
                        <p key={index}>
                          {`${target.name} - ${target.count}명`}
                        </p>
                      )
                    })
                  }
                </div>
              </div>
            </div> : null
          }
        </div>
      </div>
      {
        Club.isRecruiting ?
          <p className={Styles.Contents}>
            {Club.post.title}<br/><br/>
            {Club.post.content}
          </p> : null
      }
      {
        Club.isRecruiting ?
          Club.post.recruit.recruitURL ?
            <Link href={Club.post.recruit.recruitURL}>
              <button className={Styles.BlueButton}>신청 링크</button>
            </Link>
            :
            <button
              className={Styles.BlueButton}
              style={{backgroundColor: 'gray'}}
              disabled={true}
              onClick={Club.post.recruit.recruitURL}
            >
              신청 링크 없음
            </button>
          :
          null
      }
      
    </div>
  )
}