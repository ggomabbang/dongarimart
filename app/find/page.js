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
          <div className='Div_Fold' id={i} key={i} style={{marginTop:'1%'}}>
            <div className='Hor_Div'>
              <h4 className='Title' style={{position:'absolute', marginTop:'1%', marginLeft:'2%'}}>{a}
              <h className='SubTitle' style={{position:'absolute',marginTop:'20%', marginLeft:'160%'}}>부제목</h>
              <div className='Hor_Div'>
                <h4 className='Tag' style={{marginTop:'2%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그</h4>
                <h4 className='Tag' style={{marginTop:'2%', marginLeft:'5%', fontSize:'30px', textAlign:'center', fontStyle:'normal', letterSpacing:'3px'}}>태그2</h4>
              </div>
              </h4>
              <button className='SeeButton' style={{position:'absolute', marginLeft:'80%', marginTop:'4%'}} onClick={()=>{
                if(document.getElementById(i).style.height != "600px") document.getElementById(i).style.height = "600px";
                else document.getElementById(i).style.height = "180px";

              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="33" viewBox="0 0 18 33" fill="none">
                <path d="M17 1.5L2 16.5L17 31.5" stroke="black" stroke-width="2"/>
                </svg>
                </button>
            </div>
          </div>
        )
      })
      }</div>
    
    </div>
  )
}
