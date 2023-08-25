'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import Styles from './register.module.css';
import DongariStyles from '../find/DongariInList.module.css';
import Link from "next/link"
let numOfTags = 0;
import dynamic from 'next/dynamic';

export default dynamic (()=> Promise.resolve(MainPage),{ssr:false})
  const MainPage = () =>{
    return(
      <div className={Styles.Panel} style={{position:'absolute', marginLeft:'13.5%'}}>
            <div className={Styles.HorizonBox}>
                <h4 className={Styles.Text} style={{marginTop:'10%'}}>동아리명</h4>
                <input placeholder='동아리 이름' className={Styles.InputBox} id='clubname' style={{marginTop:'10%', width:'35vh', height:'10vh'}}
                onInput={()=>{

                }}
                ></input>
            </div>
            <div className={Styles.HorizonBox}>
                <h4 className={Styles.Text}>한 줄 소개</h4>
                <input className={Styles.InputBox} id='short_inst' placeholder='한 줄 소개'style={{marginTop:'3%'}}
                onInput={()=>{

                }}></input>
            </div>
            <div className={Styles.HorizonBox}>
                <h4 className={Styles.Text}>짧은 소개</h4>
                <textarea className={Styles.InputBox} id='inst' placeholder='짧은 동아리 소개 문구'style={{marginTop:'3%', height:'40vh'}}
                onInput={()=>{

                }}></textarea>
            </div>
            <br/><br/>
            <div className={Styles.HorizonBox}>
                <h4 className={Styles.Text}>배너</h4>
                <img className={Styles.ImageBox} style={{marginTop:'3%'}}></img>
            </div>
            <br/><br/>
            <div className={Styles.HorizonBox}>
            <button className={Styles.Button} style={{border: '3px solid #2D5DEB', marginLeft:'35%', backgroundColor:'transparent'}}>
                <h4 className={Styles.ButtonText} style={{marginTop:'7%', color:'#2D5DEB'}}>업로드</h4></button>
            <button className={Styles.Button} style={{backgroundColor: '#FF5454', marginLeft:'2%'}}>
                <h4 className={Styles.ButtonText} style={{marginTop:'7%', color:'#FFF'}}>취소</h4></button>
            </div>
            <br/><br/>
            <div className={Styles.HorizonBox}>
                <h4 className={Styles.Text}style={{marginTop:'10%',width:'5vh', height:'2vh'}}>태그</h4>
                <input id='tag' className={Styles.InputBox} placeholder='태그' style={{marginTop:'9%', width:'300px', height:'70px'}}
                onKeyUp={()=>addTag(numOfTags)}></input>
                <div id='tagZone' className={Styles.HorizonBox} style={{marginTop:'6%', marginLeft:'1%'}}>
                    
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

  function 미리보기(){
    return(
        <div className={DongariStyles.Div_Fold} id='fold' style={{marginTop:'1%'}}>
        <div className={DongariStyles.Hor_Div}>
          <h4 className={DongariStyles.Title} id='_title' style={{position:'absolute', marginTop:'1%', marginLeft:'2%'}}>
          <h className={DongariStyles.SubTitle} id='subId' style={{position:'absolute',marginTop:'25%', marginLeft:'250%'}}></h>
          <div className={DongariStyles.Hor_Div}>
            <h4 className={DongariStyles.Tag} id="tag0" style={{marginTop:'2%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}></h4>
            <h4 className={DongariStyles.Tag} id='tag1' style={{marginTop:'2%', marginLeft:'5%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}></h4>
          </div>
          </h4>
          <button className={DongariStyles.SeeButton} style={{position:'absolute', marginLeft:'90%', marginTop:'4%'}} onClick={()=>{
            if(document.getElementById("fold").style.height != "600px"){
                document.getElementById("fold").style.height = "600px";
                document.getElementById("info0").style.display = "block";
                document.getElementById("info1").style.display = "block";
                document.getElementById("info2").style.display = "block";
                document.getElementById("info3").style.display = "block";
            }
            else{
              document.getElementById("fold").style.height = "180px";
              document.getElementById("info0").style.display = "none";
              document.getElementById("info1").style.display = "none";
              document.getElementById("info2").style.display = "none";
              document.getElementById("info3").style.display = "none";
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="33" viewBox="0 0 18 33" fill="none">
            <path d="M17 1.5L2 16.5L17 31.5" stroke="black" stroke-width="2"/>
            </svg>
            </button>
        </div>
        <div  className={DongariStyles.Hor_Div}>
          <img id="img"className={DongariStyles.ClubImage} style={{position:'absolute', marginTop:'13%', marginLeft:'2%'}}/>
          <h4 id="info0" className={DongariStyles.InfoText} style={{marginTop:'15%', marginLeft:'40%'}}>소개글
          <h4 id="info1" className={DongariStyles.BlueButton}>모집기간</h4>
          <h4 id="info2"className={DongariStyles.BlueButton}>세부인원</h4>
          </h4>
        </div>
        <button id="info3" className={DongariStyles.BlueButton} style={{marginLeft:'80%', width:'200px', height:'50px'}}>자세히보기</button>
      </div>
    )
  }

