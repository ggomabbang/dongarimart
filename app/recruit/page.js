'use client';

import { useEffect, useState } from 'react';
import Styles from './recruit.module.css';
import { useRouter } from 'next/navigation';

export default function Recruit() {
  const router = useRouter();

  const [clubs, setClubs] = useState([]);
  const [selectClub, setSelectClub] = useState('');

  const GetMyClubs = async () => {
    const URL = 'http://localhost:3000';
    const rows = await fetch(URL+'/api/clubs/my', {
      method: "GET"
    });
    const jsonData = await rows.json();
    setClubs(jsonData);
  }

  const [title, setTitle] = useState('');

  const leftPad = (value) => {
    if (value >= 10) return value;
    return `0${value}`;
  }
  const toStringByFormatting = (source, delimiter = '-') => {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
  }

  const [recruitStart, setRecruitStart] = useState(toStringByFormatting(new Date()))
  const [recruitEnd, setRecruitEnd] = useState(toStringByFormatting(new Date()))

  const [recruitURL, setURL] = useState('');

  const [recruitTarget, setRecruitTarget] = useState([]);

  const targetAdder = (e) => {
    setRecruitTarget([
      ...recruitTarget,
      {
        name: '',
        count: 0
      }
    ]);
  }

  const targetDeleter = (e) => {
    const to_change = recruitTarget;
    const id = parseInt(e.target.parentElement.parentElement.id);
    to_change.splice(id, 1);
    setRecruitTarget([...to_change]);
  }

  const countAdder = (e) => {
    const to_change = recruitTarget;
    const id = parseInt(e.target.parentElement.parentElement.id);
    if (to_change[id].count) {
      to_change[id].count = 0;
    } else {
      to_change[id].count = 1;
    }
    setRecruitTarget([...to_change]);
  }

  const nameChanger = (e) => {
    const to_change = recruitTarget;
    const id = parseInt(e.target.parentElement.id);
    to_change[id].name = e.target.value;
    setRecruitTarget([...to_change]);
  }

  const countChanger = (e) => {
    const to_change = recruitTarget;
    const id = parseInt(e.target.parentElement.parentElement.id);
    if (e.target.value > 0) to_change[id].count = e.target.value;
    else to_change[id].count = 1;
    setRecruitTarget([...to_change]);
  }

  const [content, setContent] = useState('');

  const submitHandler = async (e) => {
    const clubID = selectClub;
    const toBody = {
      title,
      start: recruitStart,
      end: recruitEnd,
      url: recruitURL.length ? recruitURL : null,
      people: recruitTarget,
      content
    };

    if (clubID === '') return alert("동아리를 선택해 주세요");
    if (toBody.title === '') return alert("제목이 필요합니다.");
    if (toBody.start > toBody.end) return alert("모집 기간을 다시 확인해 주세요");
    if (toBody.content === '') return alert("본문을 작성해 주세요");

    console.log(clubID, toBody);
    
    const URL = 'http://localhost:3000';

    const res = await fetch(URL + '/api/recruit/' + clubID, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toBody)
    });

    if (res.status == 201) {
      return router.push('/');
    }
    else if (res.status == 204) {
      alert('동아리가 존재하지 않습니다.');
    }
    else if (res.status == 400) {
      alert('요청 오류.');
    }
    else if (res.status == 401) {
      alert('로그인 후 다시 진행하여 주세요.');
    }
    else if (res.status == 403) {
      alert('권한이 없습니다.');
    }
  }

  useEffect(()=>{
    GetMyClubs();
  }, []);

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리</p>
          <div className={Styles.Right}>
            <select
              className={Styles.MenuFont}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectClub(e.target.value);}
              }
              value={selectClub}
            >
              <option value='' key={-1} disabled>동아리 선택</option>
              {
                clubs.map((club, index) => {
                  return (
                    <option value={club.id} key={index}>{club.clubName}</option>
                  )
                })
              }
            </select>
          </div>
        </lable>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 제목</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='제목'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 기간</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitStart'
              value={recruitStart}
              onChange={(e) => setRecruitStart(e.target.value)}
            />
            ~
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitEnd'
              value={recruitEnd}
              onChange={(e) => setRecruitEnd(e.target.value)}
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>신청 링크</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='구글 폼, 자체 신청사이트 링크 등'
              id='recruitURL'
              value={recruitURL}
              onChange={(e) => setURL(e.target.value)}
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 인원</p>
          <div className={Styles.RightEditable}>
            {
              recruitTarget.map((role, index) => {
                return (
                  <div className={Styles.InRight} key={index} id={index}>
                    <input 
                      id={`target+${index}`}
                      value={role.name}
                      onChange={nameChanger}
                      placeholder={'역할 이름'}
                      className={Styles.TargetBox}
                    />
                    <div className={Styles.HorButtons}>
                      {
                        role.count ?
                          <input 
                            id={`count+${index}`}
                            value={role.count}
                            onChange={countChanger}
                            type='number'
                            className={Styles.NumberBox}
                          /> : null
                      }
                      <button className={Styles.UploadButton} onClick={countAdder}>
                        인원 제한
                      </button>
                      <button className={Styles.CancelButton} onClick={targetDeleter}>
                        삭제
                      </button>
                    </div>
                  </div>
                )
              }) 
            }
            <button className={Styles.AddButton} onClick={targetAdder}>
              역할 추가 +
            </button>
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 글</p>
          <div className={Styles.Right}>
            <textarea 
              className={Styles.LargeInputBox}
              placeholder='모집 공고 본문'
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>이미지</p>
          <div className={Styles.Right}>
            <img className={Styles.ImageBox}/>
          </div>
          <div className={Styles.Side}>
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
            <div className={Styles.Images}>
              <img className={Styles.ImageSmallBox}/>
              <img className={Styles.ImageSmallBox}/>
              <img className={Styles.ImageSmallBox}/>
              <img className={Styles.ImageSmallBox}/>
            </div>
          </div>
        </lable>

        <button className={Styles.UploadButton} onClick={submitHandler}>
          완료
        </button>

      </div>
    </div>
  )
}