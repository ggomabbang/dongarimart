'use client'

import Styles from './DongariInList.module.css';
import { useState } from 'react';
import Link from 'next/link';

export default function DongariInList({club, i}) {
  const [foldStyle, setFold] = useState('none');
  const [foldGap, setGap] = useState('0px');
  const recruitStyle = club.isRecruiting ? 'flex' : 'none';

  const folder = () => {
    console.log(foldStyle)
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

  return (
    <div className={Styles.Div_Fold} style={{gap: foldGap}}id={"div"+i}>
      <div className={Styles.Top}>
        <div className={Styles.Left}>
          <h4 className={Styles.Title}>{club.clubName}</h4>
          <div className={Styles.TagBox}>
            <h4 className={Styles.Tag}>태그</h4>
            <h4 className={Styles.Tag}>태그2</h4>
            <h4 className={Styles.Tag}>{club.department}</h4>
          </div>
        </div>
        <div className={Styles.Right}>
          <h1 className={Styles.SubTitle}>{club.oneLine}</h1>
          <button className={Styles.SeeButton} id={'seebtn'+i} onClick={folder}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="2em" viewBox="0 0 12 33" fill="none">
              <path d="M17 1.2L2 16.2L17 31.2" stroke="black" strokeWidth="0.5em"/>
            </svg>
          </button>
        </div>
      </div>

      <div 
        className={Styles.Bottom}
        style={{display: foldStyle}}
      >
        <img id={"img"+i} className={Styles.ClubImage}/>
        <div className={Styles.Info}>
          <h4 id={"info"+i} className={Styles.InfoText}>{club.short}</h4>
          <div className={Styles.ShortBlock} style={{display: recruitStyle}}>
            <h4 id={"info2"+i} className={Styles.BlueButton}>모집기간</h4>
            <p className={Styles.InfoText2}>{club.recruitPeriod}</p>
          </div>
          <div className={Styles.ShortBlock} style={{display: recruitStyle}}>
            <h4 id={"info3"+i} className={Styles.BlueButton}>세부인원</h4>
            <p className={Styles.InfoText2}>{club.recruitTarget}</p>
          </div>
          
        </div>
      </div>

      <Link href={'/dongari/'+club.clubid}>
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