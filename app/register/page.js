'use client';

import { useState } from 'react';
import Styles from './register.module.css';
import { useRouter } from 'next/navigation'
import DongariStyles from '../find/DongariInList.module.css';
import College from '../../public/College.json';

export default function Register() {
  const router = useRouter();

  const [clubName, setClubName] = useState("");
  const [oneLine, setOneLine] = useState("");
  const [url, setUrl] = useState("");
  const [short, setShort] = useState("");
  const [tags, setTags] = useState([]);

  const [department, setCollegeSelected] = useState("");

  const [tagValue, setTagValue] = useState("");

  const tagInputChange = (e) => {
    setTagValue(e.target.value);
  }

  const tagAdder = () => {
    if (tagValue.length){
      if (tags[0] == tagValue) {
        alert("중복 태그가 존재합니다.");
        return 0;
      }

      if (tags.length > 1) {
        alert("태그는 최대 2개까지 추가할 수 있습니다.");
        return 0;
      }
    
      setTags([...tags, tagValue]);
      setTagValue("");
    }
  }

  const tagDeleter = (e) => {
    let target = e.target.parentNode.textContent;
    target = target.slice(0, target.length-1);
    tags.splice(tags.indexOf(target), 1);
    setTags([...tags]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (clubName == '') return alert('동아리 명을 입력해 주세요.');
    if (oneLine == '') return alert('한 줄 소개를 작성해 주세요.');
    if (department == '') return alert('소속 항목을 선택해 주세요');
    if (short == '') return alert('짧은 소개를 작성해 주세요.');

    const URL = 'http://localhost:3000';

    const res = await fetch(URL + '/api/clubs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clubName,
        department,
        oneLine,
        short,
        tags,
        url,
      }),
    });

    if (res.status == 201) {
      return router.push('/');
    }
    else if (res.status == 400) {
      alert('요청 오류.');
      return router.push('/');
    }
    else if (res.status == 401) {
      alert('로그인 후 다시 진행하여 주세요.');
      return router.push('/login');
    }
  }

  return(
    <div className={Styles.Panel}>
      <div className={Styles.Input}>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 명</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='동아리 이름'
              value={clubName}
              onChange={(e)=>setClubName(e.target.value)} 
              id='clubname'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>한 줄 소개</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='한 줄 소개'
              value={oneLine}
              onChange={(e)=>setOneLine(e.target.value)}
              id='short_inst' 
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>홈페이지</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='https://wave.com'
              value={url}
              onChange={(e)=>setUrl(e.target.value)}
              id='url' 
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>소속</p>
          <div className={Styles.Right}>
            <select
              className={Styles.MenuFont}
              onChange={(e) => setCollegeSelected(e.target.value)} value={department}
            >
              <option value='' key={-1} disabled>동아리 소속 선택</option>
              {
                Object.entries(College).map(([key, value]) => {
                  if (key == 'all') return 
                  return (
                    <option value={key} key={key}>{value}</option>
                  )
                })
              }
            </select>
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>짧은 소개</p>
          <div className={Styles.Right}>
            <textarea 
              className={Styles.LargeInputBox}
              placeholder='짧은 동아리 소개 문구'
              value={short}
              onChange={(e)=>setShort(e.target.value)}
              id='inst'
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>배너</p>
          <div className={Styles.Right}>
            <img className={Styles.ImageBox}/>
            <div className={Styles.Buttons}>
              <label className={Styles.UploadButton} htmlFor='input-file'>
                업로드
              </label>
              <input 
                id="input-file"
                type="file"
                accept='image/png, image/jpeg'
                style={{display: "none"}}
              >
              </input>
              <button className={Styles.CancelButton}>취소</button>
            </div>
          </div>
        </lable>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>태그</p>
          <div className={Styles.Right}>
            <input 
              id='tag' 
              className={Styles.TagInputBox} 
              placeholder='태그'
              value={tagValue}
              onChange={tagInputChange}
              onKeyUp={(e) => {
                if (e.key == 'Enter') {
                  tagAdder()
                }
              }}
            />
            <button 
              className={Styles.UploadButton} 
              onClick={(e)=> {tagAdder()}}
            >
              추가
            </button>
            <div id='tagZone' className={Styles.TagZone}>
              {
                tags.map((tag, index) => {
                  return (
                    <h4 className={Styles.TagBox} key={index}>
                      {tag}
                      <button 
                        className={Styles.DeleteTag}
                        onClick={tagDeleter}
                      >
                        X
                      </button>
                    </h4>
                  )
                })
              }
            </div>
          </div>
        </lable>

        <button className={Styles.UploadButton} onClick={handleSubmit}>
          신청
        </button>

      </div>
    </div>
  )
}