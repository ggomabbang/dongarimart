'use client'

import Styles from './DongariInList.module.css';
import { useState } from 'react';
import Link from 'next/link';

export default function DongariInList({name, department, oneLine, short, isRecruiting, period, people, pageURL, image, i}) {
  const [foldStyle, setFold] = useState('none');

  const folder = () => {
    console.log(foldStyle)
    if (foldStyle == 'none') {
      setFold('flex');
      document.getElementById('seebtn'+i).style.rotate = "90deg";
    }
    else {
      setFold('none');
      document.getElementById('seebtn'+i).style.rotate = "-90deg";
    }
  };

  return (
    <div className={Styles.Div_Fold} id={"div"+i}>
      <div className={Styles.Top}>
        <div className={Styles.Left}>
          <h4 className={Styles.Title}>{name}</h4>
          <div className={Styles.TagBox}>
            <h4 className={Styles.Tag}>태그</h4>
            <h4 className={Styles.Tag}>태그2</h4>
          </div>
        </div>
        <div className={Styles.Right}>
          <h1 className={Styles.SubTitle}>{oneLine}</h1>
          <button className={Styles.SeeButton} id={'seebtn'+i} onClick={folder}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2.5vh" height="4vh" viewBox="0 0 18 33" fill="none">
              <path d="M17 1.5L2 16.5L17 31.5" stroke="black" strokeWidth=".3vh"/>
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
          <h4 id={"info"+i} className={Styles.InfoText}>{short}</h4>
          <div className={Styles.ShortBlock}>
            <h4 id={"info2"+i} className={Styles.BlueButton}>모집기간</h4>
            <p className={Styles.InfoText2}>{period}</p>
          </div>
          <div className={Styles.ShortBlock}>
            <h4 id={"info3"+i} className={Styles.BlueButton}>세부인원</h4>
            <p className={Styles.InfoText2}>{people}</p>
          </div>
          
        </div>
      </div>

      <Link href={'/dongari/'+name}>
        <button 
          style={{display: foldStyle}} 
          className={Styles.DetailButton}
        >
          자세히보기
        </button>
      </Link>

    </div>
  )
}