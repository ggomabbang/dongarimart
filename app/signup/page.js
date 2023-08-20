'use client';

import './Login.css'
import Link from "next/link"

export default function Home() {
  return (
        <div className='Panel'>
            <div style={{flexDirection:'column'}}>
                <input id='id' className='InputBox' placeholder='ID' style={{marginTop:'50%'}}></input>
                <input id='pw' className='InputBox' placeholder='PW' style={{marginTop:'7%'}}></input>
                <br/><br/>
                <Link href={'/signup'} style={{marginLeft:'13.5%', textDecorationLine:'none'}}>가입하기</Link>
                <Link href={'/fidpw'} style={{marginLeft:'10%', textDecorationLine:'none'}}>ID/PW찾기</Link>
                <br/><br/>
                <button className='LoginBtn' style={{marginLeft:'60%', marginTop:'10%'}}
                onClick={()=>{
                    var _id = document.getElementById('id').value;
                    var _pw = document.getElementById('pw').value;
                    if(_id == ""|| _pw == "") alert("ID나 PW를 확인해주세요");
                    else{
                        try{
                            //로그인 정보 입력
                        }
                        catch(e){
                            //예외처리 
                        }
                    }
                }}>로그인</button>
            </div>
            <div style={{width:'5px', height:'350px', background:'rgba(0,0,0,0.2)', marginRight:'5%', marginTop:'10%'}}></div>
            <img className='ADpanel' style={{marginTop:'4%', marginRight:'3%'}}></img>
        </div>
  )
}
