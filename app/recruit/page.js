'use client';

import { useEffect, useState } from 'react';
import Styles from './recruit.module.css';

export default function Recruit() {
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
    const id = parseInt(e.target.parentElement.id);
    to_change.splice(id, 1);
    setRecruitTarget([...to_change]);
  }

  const countAdder = (e) => {
    const to_change = recruitTarget;
    const id = parseInt(e.target.parentElement.id);
    if (to_change[id].count) {
      to_change[id].count = 0;
    } else {
      to_change[id].count = 1;
    }
    setRecruitTarget([...to_change]);
  }

  const countChanger = (e) => {
    const to_change = recruitTarget;
    const id = parseInt(e.target.parentElement.id);
    if (e.target.value > 0) to_change[id].count = e.target.value;
    else to_change[id].count = 1;
    setRecruitTarget([...to_change]);
  }

  useEffect(()=>{
    // console.log(recruitTarget);
  }, [recruitTarget]);

  return (
    <div className={Styles.Panel}>
      <div className={Styles.Input}>
        
        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 기간</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitStart'
            />
            ~
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitEnd'
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
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 인원</p>
          <div className={Styles.RightEditable}>
            {
              recruitTarget.map((role, index) => {
                return (
                  <div className={Styles.Right} key={index} id={index}>
                    <input 
                      id={`target+${index}`}
                      className={Styles.TargetBox}
                    />
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
                    <button className={Styles.CancelButton} onClick={targetDeleter}>삭제</button>
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
            />
          </div>
        </lable>

        <lable className={Styles.HorizonBox}>
          <p className={Styles.Left}>이미지</p>
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

        <button className={Styles.UploadButton}>
          완료
        </button>

      </div>
    </div>
  )
}