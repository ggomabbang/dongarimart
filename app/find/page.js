'use client';

import { startTransition } from 'react'
import './globals.css'

export default function Home() {
  let Groups = ['거위요', '삼겹살', '말미잘','고양이',] //동아리 정보 데이터베이스 불러오기
  return (
    <div className='Vertical_Div'>
      <div className='Horizontal_Div'>
        <input className='SearchBar' placeholder='검색해보세요 !' style={{marginLeft:'6%'}}/>
        <select className='MenuFont' style={{width:'400px', background:'transparent', marginLeft:'6%', marginRight:'3%', marginBottom:'1%', border:'none'}}>
          <option value={"cse"}>과-정보컴퓨터공학부</option>
          <option value={"mt"}>과-목탁제조학과</option>
          <option value={"dp"}>과-강아지심리학</option>
        </select>
        <h4 style={{paddingTop:'1%', paddingLeft:'.3%', marginRight:'3%', width:'7px', height:'33px', background:'grey'}} ></h4>
        <select className='MenuFont' style={{width:'400px' , background:'transparent', border:'none', marginBottom:'1%'}}>
          <option value={"name"}>이름순</option>
          <option value={"recruit"}>모집중</option>
          <option value={"hoho"}>허허</option>
        </select>
      </div>
      <div>{
      Groups.map((a,i)=>{
        return(
          <div className='Div_Fold' id={"div"+i} key={i} style={{marginTop:'1%'}}>
            <div className='Hor_Div'>
              <h4 className='Title' style={{position:'absolute', marginTop:'1%', marginLeft:'2%'}}>{a}
              <h className='SubTitle' style={{position:'absolute',marginTop:'20%', marginLeft:'160%'}}>부제목</h>
              <div className='Hor_Div'>
                <h4 className='Tag' style={{marginTop:'2%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그</h4>
                <h4 className='Tag' style={{marginTop:'2%', marginLeft:'5%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그2</h4>
              </div>
              </h4>
              <button className='SeeButton' style={{position:'absolute', marginLeft:'80%', marginTop:'4%'}} onClick={()=>{
                if(document.getElementById("div"+i).style.height != "600px"){
                  document.getElementById("div"+i).style.height = "600px";
                  document.getElementById("img"+i).style.display = "block";
                  document.getElementById("info"+j).style.display = "block";
                  document.getElementById("info2"+j).style.display = "block";
                  document.getElementById("info3"+j).style.display = "block";
                  document.getElementById("info4"+j).style.display = "block";
                }
                else{
                  document.getElementById("div"+i).style.height = "180px";
                  document.getElementById("img"+i).style.display = "none";
                  document.getElementById("info"+j).style.display = "none";
                  document.getElementById("info2"+j).style.display = "none";
                  document.getElementById("info3"+j).style.display = "none";
                  document.getElementById("info4"+j).style.display = "none";
                }
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="33" viewBox="0 0 18 33" fill="none">
                <path d="M17 1.5L2 16.5L17 31.5" stroke="black" stroke-width="2"/>
                </svg>
                </button>
            </div>
            <div  className='Hor_Div'>
              <img id={"img"+i}className='ClubImage' style={{position:'absolute', marginTop:'13%', marginLeft:'2%'}}/>
              <h4 id={"info"+i} className='InfoText' style={{marginTop:'15%', marginLeft:'40%'}}>재미있는 동아리를 찾고 있읍니까? 그러면 여기는 어떤가
              <h4 id={"info2"+i} className='BlueButton'>모집기간</h4>
              <h4 id={"info3"+i}className='BlueButton'>세부인원</h4>
              </h4>
            </div>
            <button id={"info4"+i} className='BlueButton' style={{marginLeft:'80%', width:'200px', height:'50px'}}>자세히보기</button>
          </div>
        )
      })
      }</div>
    
    </div>
  )
}
