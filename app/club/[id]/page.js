'use client'

import Styles from './club.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Colleage from '@/public/College.json'

export default function club({ params }) {
  const clubid = params.id;
  const [Club, setClub] = useState({
    id: 0,
    clubName: "로딩 중",
    department: "",
    oneLine: "",
    short: "",
    isRecruiting: false,
    tags: [],
    image: null,
  });

  const [imageSrc, setImageSrc] = useState(null);

  const GetClub = async (id) => {
    const URL = 'http://localhost:3000';
    const rows = await fetch(URL+'/api/clubs/'+id, {
      method: "GET"
    });
    const jsonData = await rows.json();
    setClub(jsonData);

    if (jsonData.image) {
      const img = fetch(`/api/image?filename=${jsonData.image}`, {
        method:"GET"
      });
      console.log(img);
    }
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
      <h1 className={Styles.PageTitle}>동아리</h1>
      <div className={Styles.Inside}>
        <div className={Styles.Top}>
          <h4 className={Styles.Title}>{Club.clubName}</h4>
          <h3 className={Styles.SubTitle}>{Club.oneLine}</h3>
        </div>
        <div className={Styles.Middle}>
          <div className={Styles.ImageBox}>
            IMAGE<img />
          </div>
          <div className={Styles.MiddleRight}>
            <div className={Styles.ShortText}>
              {
                Club.short.split('\n').map((line, index) => {
                  return (
                    <span key={`Short${index}`}>
                      {line}
                      <br />
                    </span>
                  )
                })
              }
              </div>
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
                  {Colleage[Club.classification]}
                </button>
              </div>
              {
                Club.pageURL == null ?
                  null
                :
                  <Link href={Club.pageURL}>
                    <button className={Styles.URLButton}>홈페이지</button>
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
                            {`${target.name} - ${target.count > 0 ? target.count + '명' : '인원 제한 없음'}`}
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
            <div className={Styles.Contents}>
              <h2>{Club.post.title}</h2>
              <p>{Club.post.content}</p>
            </div>
            : null
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
    </div>
  )
}