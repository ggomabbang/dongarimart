'use client'

import Styles from './find.module.css'
import DongariInList from '../component/ClubInList';
import { useEffect, useState } from 'react';
import College from '../../public/College.json';

export default function find() {
  const [Groups, setGroups] = useState([]);

  const [CollegeSelected, setCollegeSelected] = useState("all");
  const handleCollegeSelect = (e) => {
    setCollegeSelected(e.target.value);
  };

  const sortingList = [
    { value: "registration", name: "등록 순"},
    { value: "name", name: "이름 순"},
    { value: "deadline", name: "모집 마감 순"},
    { value: "popularity", name: "인기 순"},
  ];

  const [SortSelected, setSortSelected] = useState("registration");
  const handleSortSelect = (e) => {
    setSortSelected(e.target.value);
  }

  const GetClubs = async () => {
    const search = document.getElementById('search_').value;
    const tag = document.getElementById('tag_').value;

    const urlParams = new URLSearchParams('');
    if (search.length) urlParams.append("search", search);
    if (tag.length) urlParams.append("tag", tag);
    urlParams.append("sortBy", SortSelected);
    if (CollegeSelected !== "all") {
      urlParams.append("college", CollegeSelected);
    }

    const rows = await fetch('/api/clubs?' + urlParams.toString(), {
      method: "GET"
    });
    if (rows.status == 200) {
      const jsonData = await rows.json();
      setGroups(jsonData);
    }
  }

  useEffect(() => {
    GetClubs();
  }, [SortSelected, CollegeSelected])

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 찾아보기</h1>
      <div className={Styles.Horizontal_Div}>
        <form className={Styles.Search}>
          <input id='search_' className={Styles.SearchBar} placeholder='동아리 이름을 검색해보세요 !'/>
          <div className={Styles.Tag}>
            <input id='tag_' className={Styles.TagBar} placeholder='동아리 태그'/>
            <input
              type='submit'
              className={Styles.BlueButton}
              onClick={(e) => {e.preventDefault(); GetClubs();}}
              value='검색'
            />
          </div>
        </form>
        <div className={Styles.Selector}>
          <select className={Styles.MenuFont} onChange={handleCollegeSelect} value={CollegeSelected}>
            {
              Object.entries(College).map(([key, value]) => {
                return (
                  <option value={key} key={key}>{value}</option>
                )
              })
            }
          </select>
          <select className={Styles.MenuFont} onChange={handleSortSelect} value={SortSelected}>
            {
              sortingList.map((item) => {
                return <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              })
            }
          </select>
        </div>
        
      </div>
      <div className={Styles.ListBox}>
        {
          Groups.length ?
          Groups.map((club,index)=>{
            return(
              <DongariInList 
                club={club}
                i={index}
                key={`club${index}`}
              />
            );
          })
          : 
          <p>
            검색 조건과 일치하는 동아리를 발견하지 못했어요! 동아리 이름이 틀리진 않았는지, 태그가 일치하는지 다시 한번 확인해 주세요!
          </p>
        }
      </div>
    </div>
  )
}
