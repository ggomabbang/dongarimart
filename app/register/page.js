'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import Styles from './register.module.css';
import DongariStyles from '../find/DongariInList.module.css';
let numOfTags = 0;
import dynamic from 'next/dynamic';

export default dynamic (()=> Promise.resolve(MainPage),{ssr:false})
  const MainPage = () =>{
    return(
      <div className={Styles.Panel}>
        <div className={Styles.Input}>

          <div className={Styles.HorizonBox}>
            <p className={Styles.Left}>동아리 명</p>
            <div className={Styles.Right}>
              <input 
                placeholder='동아리 이름' 
                className={Styles.InputBox} 
                id='clubname'
              />
            </div>
          </div>

          <div className={Styles.HorizonBox}>
            <p className={Styles.Left}>한 줄 소개</p>
            <div className={Styles.Right}>
              <input 
                className={Styles.InputBox} 
                id='short_inst' 
                placeholder='한 줄 소개'
              />
            </div>
          </div>

          <div className={Styles.HorizonBox}>
            <p className={Styles.Left}>짧은 소개</p>
            <div className={Styles.Right}>
              <textarea 
                className={Styles.LargeInputBox} 
                id='inst' 
                placeholder='짧은 동아리 소개 문구'
              />
            </div>
          </div>

          <div className={Styles.HorizonBox}>
            <p className={Styles.Left}>배너</p>
            <div className={Styles.Right}>
              <img className={Styles.ImageBox}/>
              <div className={Styles.Buttons}>
                <button className={Styles.UploadButton}>업로드</button>
                <button className={Styles.CancelButton}>취소</button>
              </div>
            </div>
          </div>
          
          <div className={Styles.HorizonBox}>
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
          </div>

        </div>
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