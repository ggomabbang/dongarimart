'use client'

// TODO post는 있는데 recruit가 값이 없어 에러 발생. (isRecruit를 고칠시)

import Styles from './club.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { raw } from '@/app/hooks/college'
import SpanWithHyperlink from '@/app/component/textWithHyperlink';

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

  const GetClub = async (id) => {
    const rows = await fetch('/api/clubs/'+id, {
      method: "GET"
    });
    if (rows.status == 200) {
      const jsonData = await rows.json();
      setClub(jsonData);

      if (jsonData.image) {
        const img = fetch(`/api/image?filename=${jsonData.image}`, {
          method:"GET"
        });
      }
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

  const [delToggle, setDelToggle] = useState(false);

  const reportHandler = async (e) => {
    const rows = await fetch(`https://jsonip.com`, {
      method: "GET"
    });
    if (rows.status == 200) {
      const {ip} = await rows.json();
      if (document.getElementById('report_content').value.length > 0) {
        const res = await fetch(`/api/posts/report/${Club.post.id}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            contents: document.getElementById('report_content').value,
            ip,
          }),
        });
  
        switch (res.status) {
          case 201:
            document.getElementById('report_content').value = '';
            setDelToggle(0);
            return alert('신고가 접수되었습니다.');
          case 400:
            alert('요청 오류');
            return router.push('/');
          case 204:
            alert('Post ID error');
            return router.push('/');
          default:
            return alert('Unknown Error');
        }
      }
      else {
        alert('신고 내용을 입력해 주세요');
      }
    } else {
      alert('ip 서버 오류');
    }
  }

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리</h1>
      <div className={Styles.Inside}>
        <div className={Styles.Top}>
          <h4 className={Styles.Title}>{Club.clubName}</h4>
          <div className={Styles.Right}>
            <h3 className={Styles.SubTitle}>{Club.oneLine}</h3>
          </div>
        </div>
        <div className={Styles.Middle}>
          {
            Club.image ?
            <img className={Styles.ImageBox} style={{backgroundColor: 'white'}} src={`/api/image?filename=${Club.image.filename}`}/> :
            <div className={Styles.ImageBox}/>
          }
          
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
                  {raw()[Club.classification]}
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
                  <button>모집 기간</button>
                  <p>{getDate(Club.post.recruit.recruitStart)} ~ {getDate(Club.post.recruit.recruitEnd)}</p>
                </div>
                {
                  Club.post.recruit.recruitTarget.length > 2 ?
                    <div className={Styles.RecruitInner}>
                      <button>모집 인원</button>
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
                    </div> : null
                }
                
              </div> : null
            }
          </div>
        </div>
        {
          Club.isRecruiting ?
            <div className={Styles.Contents}>
              <h2>{Club.post.title}</h2>
              {
                Club.post.content.split('\n').map((line, index) => {
                  return (
                    <SpanWithHyperlink key={`line${index}`} line={line}/>
                  )
                })
              }
              {
                Club.post.image.map((img, index) => {
                  return (
                    <img src={`/api/image?filename=${img.filename}`} key={`img${index}`} />
                  )
                })
              }
            </div>
            : null
        }
        {
          Club.isRecruiting ?
            Club.post.recruit.recruitURL ?
              <Link href={Club.post.recruit.recruitURL}>
                <button className={Styles.BlueButton}>가입 신청 하기</button>
              </Link>
              :
              <button
                className={Styles.BlueButton}
                style={{backgroundColor: 'gray'}}
                disabled={true}
                onClick={Club.post.recruit.recruitURL}
              >
                가입 링크가 없습니다. 공고 내용을 확인해주세요!
              </button>
            :
            null
        }

        {
          Club.isRecruiting ?
            !delToggle ?
            <button
              className={Styles.BlueButton}
              onClick={(e)=>{
                setDelToggle(true);
              }}
              style={{
                backgroundColor: 'red'
              }}
            >
              신고
            </button>
            :
            <div className={Styles.ReportBox}>
              <input
                id='report_content'
                className={Styles.InputBox}
                placeholder='비속어, 유해한 이미지 등 신고 내용을 입력해주세요.'
              />
              <button
                className={Styles.BlueButton}
                onClick={(e)=>{setDelToggle(false)}}
                style={{
                  border: '2px solid #2D5DEB',
                  backgroundColor: 'transparent',
                  color: '#2D5DEB'
                }}
              >
                취소
              </button>
              <button
                className={Styles.BlueButton}
                onClick={reportHandler}
                style={{
                  backgroundColor: 'red'
                }}
              >
                신고
              </button>
            </div>
          : null
        }
      </div>
    </div>
  )
}