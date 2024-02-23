'use client';

import { useEffect, useState } from 'react';
import Styles from '@/app/component/inputPanel.module.css';
import { useRouter } from 'next/navigation';

export default function recruit() {
  const router = useRouter();

  const [imageSelect, setImageSelect] = useState(0);

  const [images, setImages] = useState([]);
  const [imageSrcs, setImageSrcs] = useState([null, null, null, null]);
  const imageHandler = (e) => {
    if (e.target.files.length < 2) {
      const newImages = images;
      newImages[imageSelect] = e.target.files[0];
      const newImageSrcs = imageSrcs;
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        newImageSrcs[imageSelect] = reader.result;
        setImageSrcs([...newImageSrcs]);
      }
      setImages([...newImages]);
    }
    else {
      const newImages = [];
      const newImageSrcs = [null, null, null, null];
      for (let i = 0; i < e.target.files.length; i++) {
        newImages.push(e.target.files[i]);
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = () => {
          newImageSrcs[i] = reader.result;
          setImageSrcs([...newImageSrcs]);
        }
      }
      setImages(newImages);
    }
    e.target.value = '';
  };

  const [clubs, setClubs] = useState([]);
  const [selectClub, setSelectClub] = useState('');

  const GetMyClubs = async () => {
    const rows = await fetch('/api/clubs/my', {
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
    if (toBody.start > toBody.end) return alert("모집 기간을 다시 확인해 주세요.");
    let targetOK = true;
    toBody.people.forEach((target, index) => {
      if (target.name.length == 0) {
        targetOK = false;
      }
    })
    if (!targetOK) return alert("이름이 없는 역할이 있습니다.")
    if (toBody.content === '') return alert("본문을 작성해 주세요.");

    if (images.length) {
      const formData = new FormData();
      let ok = true;
      images.forEach((img) => {
        if (img instanceof File && img.size > 0)
          if (img.size > 5*1024*1024) ok = false;
          formData.append("image", img);
      });
      if (!ok) return alert('5MB를 초과한 이미지가 있습니다.');
      const imgRes = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      const imagename = await imgRes.json();
      const imagenames = [];
      for (let i = 0; i < images.length; i++) imagenames.push(imagename[i]);
      toBody.image = imagenames;
    }
    
    const res = await fetch(`/api/recruit?clubid=${selectClub}`, {
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
    else if (res.status == 403) {
      alert('권한이 없습니다.');
      return router.push('/')
    }
  }

  useEffect(()=>{
    GetMyClubs();
  }, []);

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 모집 공고</h1>
      <div className={Styles.Input}>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리</p>
          <div className={Styles.Right}>
            <select
              className={Styles.MenuFont}
              onChange={(e) => {
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
        </label>
        
        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 제목</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='제목(필수)'
              id='title'
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 100)
                  setTitle(e.target.value)
              }}
            />
          </div>
          <div className={Styles.FixedCount}>
            {`${title.length}/100`}
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 기간</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitStart'
              value={recruitStart}
              onChange={(e) => {
                setRecruitStart(e.target.value);
                if (new Date(e.target.value) < new Date(toStringByFormatting(new Date())))
                  setRecruitEnd(toStringByFormatting(new Date()));
                else setRecruitEnd(e.target.value);
              }}
            />
            ~
            <input
              className={Styles.InputBox}
              type='date'
              id='recruitEnd'
              min={
                new Date(recruitStart) < new Date(toStringByFormatting(new Date())) ?
                toStringByFormatting(new Date())
                :
                recruitStart
              }
              value={recruitEnd}
              onChange={(e) => setRecruitEnd(e.target.value)}
            />
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>신청 링크</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='구글 폼, 자체 신청사이트 링크 등'
              id='recruitURL'
              value={recruitURL}
              onChange={(e) => {
                if (e.target.value.length <= 1000)
                  setURL(e.target.value)
              }}
            />
            <div className={Styles.FixedCount}>
              {`${recruitURL.length}/1000`}
            </div>
          </div>
        </label>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li>https, http, ://, www 등을 미포함하여 URL 전체를 입력하지 않으면 바로가기 클릭 시 접속되지 않을 수 있습니다! </li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
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
        </div>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>모집 글</p>
          <div className={Styles.Right}>
            <div className={Styles.InputWithCount}>
              <textarea 
                className={Styles.LargeInputBox}
                placeholder='모집 공고 본문(필수), 구체적인 지원 방법과 모집 일정 등을 작성해주세요'
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </label>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이미지</p>
          <div className={Styles.Right}>
            <div className={Styles.ImageRoom}>
              {
                imageSrcs[imageSelect] ?
                <img className={Styles.ImageBoxColumn} src={imageSrcs[imageSelect]}/> :
                <div className={Styles.ImageBoxColumn} />
              }
              <ul>
                
              </ul>
            </div>
            <div className={Styles.Side}>
              <div className={Styles.Buttons}>
                <label className={Styles.UploadButton} htmlFor='input-file'>
                  업로드
                  <input 
                    id="input-file"
                    type="file"
                    accept='image/png, image/jpeg'
                    multiple
                    style={{display: "none"}}
                    onChange={imageHandler}
                  />
                </label>
                <button
                  className={Styles.CancelButton}
                  onClick={(e) => {
                    setImageSelect(0);
                    setImages([]);
                    setImageSrcs([null,null,null,null]);
                  }}
                >
                  취소
                </button>
              </div>
              <div className={Styles.Images}>
                {
                  imageSrcs.map((imgSrc, index) => {
                    return (
                      <div 
                        className={Styles.ImageRoom}
                        style={index === imageSelect ? {border: '1px solid #2D5DEB'} : null}
                        key={`img${index}`}
                      >
                        {
                          index <= images.length ?
                            index == images.length ?
                            <div
                              className={Styles.ImageSmallBox}
                              onClick={(e) => setImageSelect(index)}
                            /> :
                            <img
                              className={Styles.ImageSmallBox}
                              src={imgSrc}
                              onClick={(e) => setImageSelect(index)}
                            /> :
                          <div className={Styles.ImageSmallBox} />
                        }
                        <p>{index+1}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution} style={{color: 'black'}}>
              <li>한 번에 여러장 업로드 시 순서대로 입력됩니다.</li>
              <li>번호를 누른 후 사진 1장을 업로드하면 이미지를 변경할 수 있습니다.</li>
              <li>취소를 누르면 모든 이미지가 초기화 됩니다.</li>
              <li>한 장당 이미지 용량 제한: 5MB</li>
              <li>이미지 권장 비율: 3:4</li>
            </ul>
          </div>
        </div>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>주의 사항</p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li>도배, 욕설 등의 부적절한 글은 관리자에 의해 강제 삭제될 수 있습니다.</li>
            </ul>
          </div>
        </div>

        <button className={Styles.BlueButton} onClick={submitHandler}>
          완료
        </button>

      </div>
    </div>
  )
}