'use client'

import Styles from './ClubInList.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import College from '@/public/College.json'

export default function dongariInList({club, i}) {
  const [foldStyle, setFold] = useState('none');
  const [foldGap, setGap] = useState('0px');

  const folder = () => {
    if (foldStyle == 'none') {
      setFold('flex');
      setGap('25px');
      document.getElementById('seebtn'+i).style.rotate = "90deg";
      document.getElementById('dtbtn'+i).style.display = "block";
    }
    else {
      setFold('none');
      setGap('0px');
      document.getElementById('seebtn'+i).style.rotate = "-90deg";
      document.getElementById('dtbtn'+i).style.display = "none";
    }
  };

  function getDate(date) {
    const today = new Date(date);
  
    const year = today.getFullYear(); // 2023
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 06
    const day = today.getDate().toString().padStart(2, '0'); // 18
  
    const dateString = year + '-' + month + '-' + day; // 2023-06-18
  
    return dateString;
  }

  const [recruit, setRecruit] = useState({});
  const [clubPlus, setClubPlus] = useState({
    short: '',
    image: null
  });

  useEffect(() => {
    const fetchClub = async () => {
      const res = await fetch(`/api/clubs/${club.id}`);
      const data = await res.json();
      if (data.post) setRecruit(data.post.recruit);
      const newClub = {
        short: data.short,
        image: data.image
      }
      setClubPlus(newClub);
    }
    fetchClub();
  }, [foldStyle])

  return (
    <div className={Styles.Div_Fold} style={{gap: foldGap}}id={"div"+i}>
      <div className={Styles.Top}>
        <div className={Styles.Left}>
          <h4 className={Styles.Title}>{club.clubName}</h4>
          <div className={Styles.TagBox}>
            {
              club.tags.map((tagObj) => {
                return (
                  <h4 className={Styles.Tag} key={tagObj.tagList.id}>{tagObj.tagList.tagName}</h4>
                )
              })
            }
            <h4 className={Styles.Classification}>{College[club.classification]}</h4>
          </div>
        </div>
        <div className={Styles.Right}>
          <div className={Styles.RightBox}>
            <h1 className={Styles.SubTitle}>{club.oneLine}</h1>
            <button className={Styles.SeeButton} id={'seebtn'+i} onClick={folder}>
              <svg width="1em" height="1.5em" viewBox="0 0 12 33" fill="none">
                <path d="M17 1.2L2 16.2L17 31.2" stroke="black" strokeWidth="0.5em"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div 
        className={Styles.Bottom}
        style={{display: foldStyle}}
      >
        {
          clubPlus.image ?
          <img className={Styles.ClubImage} src={`/api/image?filename=${clubPlus.image.filename}`}/>
          :
          <div className={Styles.ClubImage} />
        }
        
        <div className={Styles.Info}>
          <div className={Styles.ShortBlock}>
            <h4 className={Styles.BlueButton}>짧은 소개</h4>
            <div className={Styles.InfoText}>
              {
                clubPlus.short.split('\n').map((line, index) => {
                  return (
                    <span key={`Short${index}`}>
                      {line}<br/>
                    </span>
                  )
                })
              }
            </div>
          </div>
          {
            recruit.recruitStart ?
            <div className={Styles.MiddleLine}/> : null
          }
          {
            recruit.recruitStart ?
            <div className={Styles.ShortBlock}>
              <h4 id={"info2"+i} className={Styles.BlueButton}>모집 기간</h4>
              <div className={Styles.InfoText}>
                <span>{`${getDate(recruit.recruitStart)} ~ ${getDate(recruit.recruitEnd)}`}</span>
              </div>
            </div> : null
          }
          {
            recruit.recruitTarget ?
              recruit.recruitTarget.length > 2 ?
                <div className={Styles.ShortBlock}>
                  <h4 id={"info3"+i} className={Styles.BlueButton}>모집 인원</h4>
                  <div className={Styles.InfoText}>
                    {
                      JSON.parse(recruit.recruitTarget).map((target, index) => {
                        return (
                          <span key={index}>
                            {`${target.name} - ${target.count > 0 ? target.count + '명' : '인원 제한 없음'}`}<br/>
                          </span>
                        )
                      })
                    }
                  </div>
                </div> 
              : null 
            : null
          }
        </div>
      </div>
      
      <Link href={'/club/'+club.id} className={Styles.DetailWrap}>
        <button 
          id={"dtbtn" + i} 
          className={Styles.DetailButton}
        >
          자세히보기
        </button>
      </Link>  

    </div>
  )
}