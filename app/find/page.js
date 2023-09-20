'use client'

import Styles from './find.module.css'
import DongariInList from './DongariInList';
import { useEffect, useState } from 'react';
import College from './College.json';

export default function Home() {
  const [Groups, setGroups] = useState([]);

  const GetClubs = async () => {
    const URL = 'http://localhost:3000';
    const college = 'all';
    const parameter = '?college=' + college;
    const rows = await fetch(URL+'/api/clubs'+parameter, {
      method: "GET"
    });
    const jsonData = await rows.json();
    setGroups(jsonData);
    console.log(Groups);
  }

  useEffect(() => {
    GetClubs();
  }, [])

  return (
    <div className={Styles.Vertical_Div}>
      <div className={Styles.Horizontal_Div}>
        <input className={Styles.SearchBar} placeholder='검색해보세요 !'/>
        <div className={Styles.Selector}>
          <select className={Styles.MenuFont}>
            {
              Object.entries(College).map(([key, value]) => {
                return (
                  <option value={key}>{value}</option>
                )
              })
            }
          </select>
          <select className={Styles.MenuFont}>
            <option value={"name"}>이름순</option>
            <option value={"recruit"}>모집중</option>
            <option value={"hoho"}>허허</option>
          </select>
        </div>
        
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
    </div>
  )
}
