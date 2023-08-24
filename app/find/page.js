'use client';

import { startTransition } from 'react'
import './find.css'

export default function Home() {
  let Groups = ['거위', '삼겹살', '말미잘','고양이',] //동아리 정보 데이터베이스 불러오기
  return (
    <div className='Vertical_Div'>
      <div className='Horizontal_Div'>
        <input className='SearchBar' placeholder='검색해보세요 !' style={{marginLeft:'3%'}}/>
        <select className='MenuFont' style={{width:'18vw', background:'transparent', marginLeft:'1%', marginRight:'3%', marginBottom:'1%', border:'none'}}>
          <option value={"cse"}>과-정보컴퓨터공학부</option>
          <option value={"mt"}>과-목탁제조학과</option>
          <option value={"dp"}>과-강아지심리학</option>
        </select>
        <h4 style={{paddingTop:'1%', paddingLeft:'.3%', marginRight:'3%', width:'7px', height:'33px', background:'grey'}} ></h4>
        <select className='MenuFont' style={{width:'10vw' , background:'transparent', border:'none', marginBottom:'1%'}}>
          <option value={"name"}>이름순</option>
          <option value={"recruit"}>모집중</option>
          <option value={"hoho"}>허허</option>
        </select>
      </div>
      <div>
      {
      Groups.map((a,i)=>{
        return(
          <div className='Div_Fold' id={"div"+i} key={i} style={{marginTop:'1%'}}>
            <div className='Hor_Div'>
              <h4 className='Title' style={{position:'absolute', marginTop:'1%', marginLeft:'2%'}}>{a}</h4>
              <h className='SubTitle' style={{position:'absolute',marginTop:'4.5%', marginLeft:'26%'}}>부제목</h>
              <button className='SeeButton' id={'seebtn'+i} style={{position:'absolute', marginLeft:'68%', marginTop:'4%'}} onClick={()=>{
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
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2.5vh" height="4vh" viewBox="0 0 18 33" fill="none">
                <path d="M17 1.5L2 16.5L17 31.5" stroke="black" stroke-width=".3vh"/>
                </svg>
                </button>
            </div>
            <br/><br/><br/><br/>
            <div className='Hor_Div' style={{marginLeft:'2.5%'}}>
                <h4 className='Tag' style={{marginTop:'2%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그</h4>
                <h4 className='Tag' style={{marginTop:'2%', marginLeft:'1%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그2</h4>
              </div>
            <div  className='Hor_Div'>
              <img id={"img"+i}className='ClubImage' style={{position:'absolute', marginLeft:'2%'}}/>
              <h4 id={"info"+i} className='InfoText' style={{ marginLeft:'40%'}}>소개글</h4>
            </div>
            <h4 id={"info2"+i} className='BlueButton' style={{marginLeft:'40%'}}>모집기간</h4>
            <h4 id={"info3"+i}className='BlueButton'style={{marginLeft:'40%'}}>세부인원</h4>
            <button id={"info4"+i} className='BlueButton' style={{marginLeft:'70%', marginTop:'-2%', width:'30vh', height:'7vh'}}>자세히보기</button>
          </div>
        )
      })
      }</div>
    </div>
  )
}
