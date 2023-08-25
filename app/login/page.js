'use client';

import Styles from './Login.module.css';
import Link from "next/link"
export default function Home() {
  return (
        <div className={Styles.Panel}>
            <div style={{flexDirection:'column'}}>
                <img src='/WAVE.png' style={{width:'28vh', height:'11vh', marginTop:'20%', marginLeft:'27%'}}></img>
                <input id='id' className={Styles.InputBox} placeholder='ID' style={{marginTop:'10%'}}></input>
                <input id='pw' className={Styles.InputBox} placeholder='PW' style={{marginTop:'7%'}}></input>
                <br/><br/>
                <Link href={'/signup'} style={{marginLeft:'13.5%', textDecorationLine:'none'}}>가입하기</Link>
                <Link href={'/fidpw'} style={{marginLeft:'10%', textDecorationLine:'none'}}>ID/PW찾기</Link>
                <br/><br/>
                <button className={Styles.LoginBtn} style={{marginLeft:'60%', marginTop:'10%'}}
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
                }}>로그인</button>
            </div>
            <div style={{width:'5px', height:'350px', background:'rgba(0,0,0,0.2)', marginRight:'5%', marginTop:'10%'}}></div>
            <img className={Styles.ADpanel} style={{marginTop:'5%', marginRight:'4%'}}></img>
        </div>
  )
}