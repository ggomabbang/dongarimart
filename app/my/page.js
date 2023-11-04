'use client'

import DongariInList from '../find/DongariInList';
import Styles from './my.module.css';
import { useEffect, useState } from 'react';

export default function My() {
  const [User, setUser] = useState({});
  const [Groups, setGroups] = useState([]);

  const GetMyinfo = async () => {
    const URL = 'http://localhost:3000';
    const rows = await fetch(URL+'/api/users/my', {
      method: "GET"
    });
    const jsonData = await rows.json();
    setUser(jsonData);
    console.log(User);
  }

  const GetMyClubs = async () => {
    const URL = 'http://localhost:3000';
    const rows = await fetch(URL+'/api/clubs/my', {
      method: "GET"
    });
    const jsonData = await rows.json();
    setGroups(jsonData);
  }

  useEffect(() => {
    GetMyClubs();
    GetMyinfo();
  }, [])

  return (
    <div className={Styles.Content}>
      <div className={Styles.InputPanel}>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이름</p>
          <div className={Styles.Right}>
            <input 
            value={User.name}
            className={Styles.InputBox} 
            readOnly
            id='name_box'
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이메일</p>
          <div className={Styles.Right}>
            <input 
            value={User.email}
            className={Styles.InputBox} 
            readOnly
            id='name_box'
            />
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul>
              {
                User.verifiedEmail ? 
                  <li id={Styles.email_check}>인증된 이메일 ✅</li> :
                  <li id={Styles.email_uncheck}>인증되지 않은 이메일 ❌</li>
              }
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>비밀번호</p>
          <div className={Styles.Right}>
            <button className={Styles.BlueButton}>비밀번호 변경하기</button>
          </div>
        </div>

      </div>

      <div className={Styles.DongariPanel}>
        <div className={Styles.Top}>
          <h1 className={Styles.Title}>관리중인 동아리 🔧</h1>
        </div>
        <div className={Styles.ListBox}>
          {
            Groups.map((club,index)=>{
              return(
                <DongariInList 
                  club={club}
                  i={index} 
                  key={club.clubid}
                />
              );
            })
          }
        </div>
        <div className={Styles.ButtonSpace}>
          <button className={Styles.BlueButton}>관리하기</button>
        </div>
      </div>

      <div className={Styles.DongariPanel}>
        <div className={Styles.Top}>
          <h1 className={Styles.Title}>소속된 동아리 📌</h1>
        </div>
        <div className={Styles.ListBox}>

        </div>
      </div>
    </div>
  )
}