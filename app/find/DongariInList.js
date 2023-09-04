'use client'

import Styles from './DongariInList.module.css';
import { useState } from 'react';

export default function DongariInList({a, i}) {
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
          <h4 className={Styles.Title}>{a}</h4>
          <div className={Styles.TagBox}>
            <h4 className={Styles.Tag}>태그</h4>
            <h4 className={Styles.Tag}>태그2</h4>
          </div>
        </div>
        <div className={Styles.Right}>
          <h1 className={Styles.SubTitle}>부제목</h1>
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
          <h4 id={"info"+i} className={Styles.InfoText}>환영합니다 소개글입뉘당 ^^ TEST TEST</h4>
          <div className={Styles.ShortBlock}>
            <h4 id={"info2"+i} className={Styles.BlueButton}>모집기간</h4>
            <text className={Styles.InfoText2}>00.00.00 ~ 00.00.00</text>
          </div>
          <div className={Styles.ShortBlock}>
            <h4 id={"info3"+i} className={Styles.BlueButton}>세부인원</h4>
            <text className={Styles.InfoText2}>2000명</text>
          </div>
          
        </div>
      </div>

      <button 
        style={{display: foldStyle}} 
        className={Styles.DetailButton}
      >
        자세히보기
      </button>
    </div>
  )
}