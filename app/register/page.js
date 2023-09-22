'use client';

import { useEffect, useState } from 'react';
import Styles from './register.module.css';
import DongariStyles from '../find/DongariInList.module.css';
let numOfTags = 0;

export default function Register() {
const [clubName, setClubName] = useState("");
const [oneLine, setOneLine] = useState("");
const [short, setShort] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

  }
  return(
    <div className={Styles.Panel}>
      <form className={Styles.Input} onSubmit={handleSubmit}>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 명</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='동아리 이름'
              value={clubName}
              onChange={(e)=>setClubName(e.target.value)} 
              id='clubname'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>한 줄 소개</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='한 줄 소개'
              value={oneLine}
              onChange={(e)=>setOneLine(e.target.value)}
              id='short_inst' 
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>짧은 소개</p>
          <div className={Styles.Right}>
            <textarea 
              className={Styles.LargeInputBox}
              placeholder='짧은 동아리 소개 문구'
              value={short}
              onChange={(e)=>setShort(e.target.value)}
              id='inst'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>배너</p>
          <div className={Styles.Right}>
            <img className={Styles.ImageBox}/>
            <div className={Styles.Buttons}>
              <button className={Styles.UploadButton}>업로드</button>
              <button className={Styles.CancelButton}>취소</button>
            </div>
          </div>
        </lable>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>태그</p>
          <div className={Styles.Right}>
            <input 
              id='tag' 
              className={Styles.TagInputBox} 
              placeholder='태그' 
              onKeyUp={()=>addTag(numOfTags)}
            />
            <div id='tagZone' className={Styles.TagZone}></div>
          </div>
        </lable>

      </form>
    </div>
  )
}

function addTag(t){
  if(window.event.keyCode == 13){
      if(t < 2){
          let tagArea = document.getElementById('tagZone'); let tagText = document.getElementById('tag').value;
          const newTag = document.createElement('h4'); const TagButton = document.createElement('button');
          TagButton.setAttribute('class', Styles.DeleteTag);
          TagButton.innerHTML = 'X';
          TagButton.onclick=function(){(deleteTag(t));};
          newTag.setAttribute('class', Styles.TagBox);
          newTag.setAttribute('id', t);
          newTag.innerHTML = tagText;
          newTag.appendChild(TagButton);
          tagArea.appendChild(newTag);
          numOfTags = t+1;
          //document.getElementById("tag" + t).textContent = tagText;
          document.getElementById('tag').value = "";
      }
      else alert("태그는 최대 2개까지 추가할 수 있습니다");
  }
}

function deleteTag(t){
  var myTag = document.getElementById(t);
  var parent = myTag.parentElement;
  parent.removeChild(myTag);
  //document.getElementById("tag" + t).innerText = "태그" + (t+1);
  numOfTags = numOfTags -1;
}