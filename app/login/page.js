'use client';

import Styles from './Login.module.css';
import Link from "next/link"
export default function Home() {
  return (
        <div className={Styles.Panel}>
            <div className={Styles.LoginContent}>
                <div className={Styles.Logo}>
                    <img src='/WAVE.png'/>
                </div>
                <div className={Styles.LoginInput}>
                    <input id='id' className={Styles.InputBox} placeholder='ID'/>
                    <input id='pw' className={Styles.InputBox} placeholder='PW'/>
                    <div className={Styles.Bottom}>
                        <Link href={'/signup'}>가입하기</Link>
                        <Link href={'/fidpw'}>ID/PW찾기</Link>
                    </div>
                </div>
                <button className={Styles.LoginBtn}
                onClick={()=>{
                    var _id = document.getElementById('id').value;
                    var _pw = document.getElementById('pw').value;
                    if(_id == ""|| _pw == "") alert("ID나 PW를 확인해주세요");
                    else{
                        try{
                            //로그인 정보 입력
                            location.replace('http://localhost:3000/');
                        }
                        catch(e){
                            //예외처리 
                        }
                    }
                }}
                >
                    로그인
                </button>
            </div>
            <div className={Styles.MiddleLine}/>
            <div className={Styles.ADpanel}>
                AD
            </div>

        </div>
  )
}