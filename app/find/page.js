'use client'

import Styles from './find.module.css'
import DongariInList from '../component/ClubInList';
import { useEffect, useState, useRef } from 'react';
import { raw, mainCategory, subcategories } from '@/app/hooks/college';

export default function find() {
  const [Groups, setGroups] = useState([]);
  const [Pages, setPages] = useState(1);
  const [Page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [collegePanel, setCollegePanel] = useState(false);
  const [mainCollegeSelected, setMainCollegeSelected] = useState("all");
  const [CollegeSelected, setCollegeSelected] = useState("all");

  const sortingList = {
    registration: '등록 순',
    name: '이름 순',
    deadline: '모집 마감 순',
    popularity: '인기 순'
  };
  const [sortPanel, setSortPanel] = useState(false);
  const [SortSelected, setSortSelected] = useState("popularity");

  const [reverse, setReverse] = useState(0);
  const [isRecruiting, setIsRecruiting] = useState(0);

  const GetClubs = async () => {
    const search = document.getElementById('search_').value;
    const tag = document.getElementById('tag_').value;
    setCurrentPage(Page);

    const urlParams = new URLSearchParams('');
    if (search.length) urlParams.append("search", search);
    if (tag.length) urlParams.append("tag", tag);
    urlParams.append("sortBy", SortSelected);
    if (CollegeSelected !== "all") {
      urlParams.append("college", CollegeSelected);
    }
    urlParams.append("pagination", 10);
    urlParams.append("page", Page);
    urlParams.append("reverse", reverse);
    urlParams.append("isRecruiting", isRecruiting);

    // URL 동적으로 업데이트 
    const newURL = `${window.location.pathname}?${urlParams.toString()}`; 
    window.history.pushState({ path: newURL }, '', newURL); 
    // 검색 버튼 클릭 -> URL 변경 

    const rows = await fetch('/api/clubs?' + urlParams.toString(), {
      method: "GET"
    });
    if (rows.status == 200) {
      const jsonData = await rows.json();
      setGroups(jsonData.clubList);
      setPages(jsonData.maxPage);
    }
  }

  const isMounted = useRef(false);
  const isMounted2 = useRef(false);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    GetClubs();
  }, [Page])

  useEffect(() => {
    if (isMounted2.current) {
      if (!clear) GetClubs();
    }
    else isMounted2.current = true;
  }, [clear])

  useEffect(() => {
    if (isMounted.current) {
      setClear(true);
      setPage(1);
      if (Page==1) GetClubs();
    }
    else isMounted.current = true;
  }, [SortSelected, CollegeSelected, reverse, isRecruiting])

  // 페이지 로드 -> URL 파라미터 추출하여 상태 결정
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const searchQuery = urlParams.get('search') || '';
    const tagQuery = urlParams.get('tag') || '';
    const sortByQuery = urlParams.get('sortBy') || 'popularity';
    const pageQuery = parseInt(urlParams.get('page')) || 1;
    const reverseQuery = parseInt(urlParams.get('reverse')) || 0;
    const isRecruitingQuery = parseInt(urlParams.get('isRecruiting')) || 0;

    document.getElementById('search_').value = searchQuery;
    document.getElementById('tag_').value = tagQuery;

    setSortSelected(sortByQuery);
    setPage(pageQuery);
    setReverse(reverseQuery);
    setIsRecruiting(isRecruitingQuery);

    GetClubs();

    // 뒤로가기/ 앞으로가기 시 상태 유지 
    window.onpopstate = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      const searchQuery = urlParams.get('search') || '';
      const tagQuery = urlParams.get('tag') || '';
      const sortByQuery = urlParams.get('sortBy') || 'popularity';
      const pageQuery = parseInt(urlParams.get('page')) || 1;
      const reverseQuery = parseInt(urlParams.get('reverse')) || 0;
      const isRecruitingQuery = parseInt(urlParams.get('isRecruiting')) || 0;

      document.getElementById('search_').value = searchQuery;
      document.getElementById('tag_').value = tagQuery;

      setSortSelected(sortByQuery);
      setPage(pageQuery);
      setReverse(reverseQuery);
      setIsRecruiting(isRecruitingQuery);

      GetClubs();
    };
  }, []);

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 찾아보기</h1>
      <div className={Styles.Horizontal_Div}>
        <form className={Styles.Search}>
          <input id='search_' className={Styles.SearchBar} onChange={(e)=>setClear(true)} placeholder='동아리 이름을 검색해보세요 !'/>
          <div className={Styles.Tag}>
            <input id='tag_' className={Styles.TagBar} onChange={(e)=>setClear(true)} placeholder='동아리 태그'/>
            <input
              type='submit'
              disabled={clear ? false : true}
              style={clear ? null : {backgroundColor: 'gray'}}
              className={Styles.BlueButton}
              onClick={(e) => {
                e.preventDefault();
                setSortPanel(false);
                setCollegePanel(false);
                GetClubs();
              }}
              value='검색'
            />
          </div>
        </form>
        <div className={Styles.Selector}>
          <button
            className={Styles.Clear}
            disabled={clear ? false : true}
            style={clear ? null : {display: 'none'}}
            onClick={(e)=>{
              setSortPanel(false);
              setCollegePanel(false);
              setSortSelected('popularity');
              setCollegeSelected('all');
              setMainCollegeSelected('all');
              document.getElementById('search_').value = ''
              document.getElementById('tag_').value = ''
              setClear(false);
              isMounted.current = false;
            }}
          >
            초기화
          </button>
          <button
            className={Styles.MenuFont} 
            onClick={(e)=>{
              setCollegePanel(!collegePanel);
              setSortPanel(false);
            }}
            style={collegePanel ? {backgroundColor:'#2D5DEB', color:'white'}:null}
          >
            {raw()[CollegeSelected]}
            <svg width=".6em" height=".9em" style={{transform: 'rotate(-90deg)'}} viewBox="10 0 10 50" fill="none">
              <path d="M17 1.2L2 16.2L17 31.2" stroke={collegePanel?"white":"#2D5DEB"} strokeWidth="0.5em"/>
            </svg>
          </button>
          <button
            className={Styles.MenuFont}
            onClick={(e)=>{
              setSortPanel(!sortPanel);
              setCollegePanel(false);
            }}
            style={sortPanel ? {backgroundColor:'#2D5DEB', color:'white'}:null}
          >
            {sortingList[SortSelected]}
            <svg width=".6em" height=".9em" style={{transform: 'rotate(-90deg)'}} viewBox="10 0 10 50" fill="none">
              <path d="M17 1.2L2 16.2L17 31.2" stroke={sortPanel?"white":"#2D5DEB"} strokeWidth="0.5em"/>
            </svg>
          </button>
        </div>
      </div>
      <div className={Styles.SelectPanel} style={collegePanel ? null:{display:'none'}}>
        <ul className={Styles.SelectList}>
          <p>동아리 분류</p>
          {
            Object.entries(mainCategory()).map(([key, value]) => {
              return (
                <li
                  key={key}
                  onClick={(e)=>{
                    setMainCollegeSelected(key);
                    setCollegeSelected(key);
                  }}
                  style={
                    key === mainCollegeSelected ?
                    {backgroundColor: '#2D5DEB', color: 'white'}:null
                  }
                >{value}</li>
              )
            })
          } 
        </ul>
        <ul className={Styles.SelectList}>
          <p>{raw()[mainCollegeSelected]}</p>
          {
            Object.entries(subcategories(mainCollegeSelected)).map(([key, value]) => {
              return (
                <li 
                  key={key}
                  onClick={(e)=>{
                    setCollegeSelected(key);
                  }}
                  style={
                    key === CollegeSelected ?
                    {backgroundColor: '#2D5DEB', color: 'white'}:null
                  }
                >{value}</li>
              )
            })
          }
          <button className={Styles.PanelClose} onClick={(e)=>setCollegePanel(false)}>닫기 x</button>
        </ul>
      </div>
      <div className={Styles.SelectPanel} style={sortPanel ? null:{display:'none'}}>
        <ul className={Styles.SelectList}>
          <p>정렬</p>
          {
            Object.entries(sortingList).map(([key, value]) => {
              return (
                <li
                  key={key}
                  onClick={(e)=>{
                    setSortSelected(key);
                  }}
                  style={
                    key === SortSelected ?
                    {backgroundColor: '#2D5DEB', color: 'white'}:null
                  }
                >{value}</li>
              )
            })
          } 
        </ul>
        <ul className={Styles.SelectList}>
          <p>옵션</p>
          <li 
            onClick={(e)=>{
              setReverse(Math.abs(reverse-1));
            }}
            style={
              reverse ?
              {backgroundColor: '#2D5DEB', color: 'white'}:null
            }
          >역순</li>
          <li 
            onClick={(e)=>{
              setIsRecruiting(Math.abs(isRecruiting-1));
            }}
            style={
              isRecruiting ?
              {backgroundColor: '#2D5DEB', color: 'white'}:null
            }
          >모집 중</li>
          <button className={Styles.PanelClose} onClick={(e)=>setSortPanel(false)}>닫기 x</button>
        </ul>
      </div>
      <div className={Styles.ListBox}>
        {
          Groups.length ?
          Groups.map((club,index)=>{
            return(
              <DongariInList 
                club={club}
                i={`${club.clubName}${index}`}
                key={`${club.clubName}${index}`}
              />
            );
          })
          : 
          <p>
            검색 조건과 일치하는 동아리를 발견하지 못했어요! 동아리 이름이 틀리진 않았는지, 태그가 일치하는지 다시 한번 확인해 주세요!
          </p>
        }
      </div>
      <form className={Styles.Page}>
        <div className={Styles.PageBar}>
          <button
            className={Styles.PageBlock}
            disabled={Page<=1 ? true:false}
            style={Page<=1 ? {backgroundColor:'lightgray'}:null}
            onClick={(e)=>{
              e.preventDefault();
              setPage(Page-1);
            }}
          >{'<'}</button>
          <input
            id="page_input"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value)}
          />
          <h6>/ {Pages}</h6>
          <button
            className={Styles.PageBlock}
            disabled={Page>=Pages ? true:false}
            style={Page>=Pages ? {backgroundColor:'lightgray'}:null}
            onClick={(e)=>{
              e.preventDefault();
              setPage(Page+1);
            }}
          >{'>'}</button>
        </div>
        <input
          type='submit'
          className={Styles.PageEnter}
          disabled={Pages ? false : true}
          style={Pages ? null : {backgroundColor: 'gray'}}
          value='Enter'
          onClick={(e)=>{
            e.preventDefault();
            const n = parseInt(currentPage);
            if (n && 0 < n && n <= Pages) {
              setPage(n);
            } else {
              alert(`1~${Pages} 페이지 중 하나를 입력해주세요.`);
            }
          }}
        />
      </form>
    </div>
  )
}
