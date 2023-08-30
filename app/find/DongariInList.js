'use client'

import Styles from './DongariInList.module.css';

export default function DongariInList({a, i}) {
  return (
    <div className={Styles.Div_Fold} id={"div"+i}>
      <div className={Styles.Hor_Div}>
        <h4 className={Styles.Title}>{a}</h4>
        <h className={Styles.SubTitle}>부제목</h>
        <button 
          className={Styles.SeeButton}
          id={'seebtn'+i}
          onClick={()=>{
            if(document.getElementById("div"+i).style.height != "85vh"){
              document.getElementById("seebtn"+i).style.rotate = "90deg"
              document.getElementById("div"+i).style.height = "85vh";
              document.getElementById("img"+i).style.display = "block";
              document.getElementById("info"+i).style.display = "block";
              document.getElementById("info2"+i).style.display = "block";
              document.getElementById("info3"+i).style.display = "block";
              document.getElementById("info4"+i).style.display = "block";
            }
            else{
              document.getElementById("seebtn"+i).style.rotate = "-90deg"
              document.getElementById("div"+i).style.height = "26vh";
              document.getElementById("img"+i).style.display = "none";
              document.getElementById("info"+i).style.display = "none";
              document.getElementById("info2"+i).style.display = "none";
              document.getElementById("info3"+i).style.display = "none";
              document.getElementById("info4"+i).style.display = "none";
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="2.5vh" height="4vh" viewBox="0 0 18 33" fill="none">
            <path d="M17 1.5L2 16.5L17 31.5" stroke="black" stroke-width=".3vh"/>
          </svg>
        </button>
      </div>
      <br/><br/><br/><br/>
      <div className={Styles.Hor_Div}>
        <h4 className={Styles.Tag}>태그</h4>
        <h4 className={Styles.Tag}>태그2</h4>
      </div>
      <div className={Styles.Hor_Div}>
        <img id={"img"+i}className={Styles.ClubImage}/>
        <h4 id={"info"+i} className={Styles.InfoText}>소개글</h4>
      </div>
      <h4 id={"info2"+i} className={Styles.BlueButton}>모집기간</h4>
      <h4 id={"info3"+i}className={Styles.BlueButton}>세부인원</h4>
      <button id={"info4"+i} className={Styles.BlueButton}>자세히보기</button>
    </div>
  )
}