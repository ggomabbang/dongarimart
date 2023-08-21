'use client'

import './globals.css'
import Link from "next/link"

export default function Home() {
  return (
    <div  style={{marginTop:'2%'}}>
      <AD_Banner/>
      <div className='SideDiv' style={{marginTop:'-70%'}}>
      <button onClick={()=>{location.replace('http://localhost:3000/find')}} className='Find_Btn'
      style={{marginLeft:'35%'}}>동아리 찾아보기</button>
      <div className='InnerDiv' style={{marginTop:'3.8%', marginLeft:'67%'}}>
      <button onClick={()=>{location.replace('http://localhost:3000/rcr')}} className='Recruit_Btn'>모집하기</button>
      <div><h4></h4></div>
      <button className='Register_Btn' onClick={()=>{location.replace('http://localhost:3000/upload')}}>등록/관리</button>
    </div>
      </div>
    <div className='SettingPanel' style={{marginLeft:'22.5%', marginTop:'-31.5%'}}></div>
  </div>
  )
}


function AD_Banner(){
  return (
    <div>
        <section class="ADBANNER" aria-label="Gallery">
        <ol class="viewport">
            <li id="slide1" tabindex="1" class="slide">
            <div class="snapper">
                <a href="#slide3" class="prev"></a>
                <a href="#slide2" class="next"></a>
            </div>
            </li>
            <li id="slide2" tabindex="2" class="slide">
            <div class="snapper">
                <a href="#slide1" class="prev"></a>
                <a href="#slide3" class="next"></a>
            </div>
            </li>
            <li id="slide3" tabindex="3" class="slide">
            <div class="snapper">
                <a href="#slide2" class="prev"></a>
                <a href="#slide1" class="next"></a>
            </div>
            </li>
        </ol>
        </section>
        <aside class="navigation">
    <ol class="navigation-list">
    <li class="navigation-item">
        <a href="#slide1" class="navigation-button">Go to slide 1</a>
    </li>
    <li class="navigation-item">
        <a href="#slide2" class="navigation-button">Go to slide 2</a>
    </li>
    <li class="navigation-item">
        <a href="#slide3" class="navigation-button">Go to slide 3</a>
    </li>
    </ol>
  </aside>
        </div>
  )
}