'use client';

import { useEffect, useState } from 'react';
import Styles from '@/app/component/inputPanel.module.css';
import { useRouter } from 'next/navigation';

export default function recruit({params}) {
  const router = useRouter();

  const [imageSelect, setImageSelect] = useState(0);
  const [images, setImages] = useState([]);
  const [imageSrcs, setImageSrcs] = useState([null, null, null, null]);
  const imageHandler = (e) => {
    if (e.target.files.length > 4) return alert("이미지를 5개 이상 선택할 수 없습니다.");
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

  const [currentImgSel, setCurrentImgSel] = useState(0);
  const [currentSrc, setCurrentSrc] = useState([]);

  const [clubs, setClubs] = useState([]);
  const [selectClub, setSelectClub] = useState('');

  const [postOrigin, setPostOrigin] = useState({
    id: 0,
    title: '',
    content: '',
    recruit: {
      recruitStart: '',
      recruitEnd: '',
      recruitTarget: '',
      recruitURL: ''
    }
  });

  const GetClub = async () => {
    const rows = await fetch(`/api/clubs/${params.id}`, {
      method : "GET",
    });
    const jsonData = await rows.json();
    if (rows.status == 200) {
      setClubs([jsonData]);
      setSelectClub(params.id);
      if (jsonData.post) {
        const post = jsonData.post;
        const newPostOrigin = {
          id: 0,
          title: '',
          content: '',
          recruit: {
            recruitStart: '',
            recruitEnd: '',
            recruitTarget: '',
            recruitURL: ''
          }
        };
        newPostOrigin.id = post.id;
        setTitle(post.title);
        newPostOrigin.title = post.title;
        setRecruitStart(post.recruit.recruitStart.slice(0, 10));
        newPostOrigin.recruit.recruitStart = post.recruit.recruitStart.slice(0, 10);
        setRecruitEnd(post.recruit.recruitEnd.slice(0, 10));
        newPostOrigin.recruit.recruitEnd = post.recruit.recruitEnd.slice(0, 10);

        if(post.recruit.recruitEnd === '9999-12-31T00:00:00.000Z') {
          setIsAlwaysRecruit(true);
          setRecruitEnd('9999-12-31');
        } else {
          setIsAlwaysRecruit(false);
        }
        setRecruitTarget(JSON.parse(post.recruit.recruitTarget));
        newPostOrigin.recruit.recruitTarget = post.recruit.recruitTarget;
        if (post.recruit.recruitURL) {
          setURL(post.recruit.recruitURL);
          newPostOrigin.recruit.recruitURL = post.recruit.recruitURL;
        }
        setContent(post.content);
        newPostOrigin.content = post.content;
        setCurrentSrc(post.image.map((img) => `/api/image?filename=${img.filename}`));
        setPostOrigin(newPostOrigin);
      }
    }
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
  const [IsAlwaysRecruiting, setIsAlwaysRecruit] = useState(false);

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
    e.preventDefault();

    const clubID = selectClub;
    const toBody = {};

    if (clubID === '') return alert("동아리를 선택해 주세요");
    if (toBody.title === '') return alert("제목이 필요합니다.");
    if (toBody.start > toBody.end) return alert("모집 기간을 다시 확인해 주세요.");
    let targetOK = true;
    recruitTarget.forEach((target, index) => {
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

    if (postOrigin.recruit.recruitStart !== recruitStart || postOrigin.recruit.recruitEnd !== recruitEnd) {
      toBody.start = recruitStart;
      toBody.end = recruitEnd;
    }

    postOrigin.recruit.recruitURL !== recruitURL ? toBody.url = recruitURL : null;
    const targetString = JSON.stringify(recruitTarget)
    postOrigin.recruit.recruitTarget !== targetString ? toBody.people = recruitTarget : null;
    postOrigin.title !== title ? toBody.title = title : null;
    postOrigin.content !== content ? toBody.content = content : null;

    const res = await fetch(`/api/recruit/${postOrigin.id}`, {
      method: 'PATCH',
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

  const deleteHandler = async (e) => {
    if (confirm('모집 공고를 삭제하시겠습니까?')) {
      const res = await fetch(`/api/recruit/${postOrigin.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      switch (res.status) {
        case 200:
          return router.push('/');
        case 204:
          alert('요청 오류. ID');
          return router.push('/');
        case 400:
          alert('요청 오류');
          return router.push('/');
        case 401:
          alert('로그인 후 다시 진행하여 주세요.');
          return router.push('/login');  
        case 403:
          alert('권한이 없습니다!');
          return router.push('/');
        default:
          return alert('Error');
      }
    }
  }

  const endHandler = async (e) => {

    const toBody = {};
    // 여기
    toBody.start = postOrigin.recruit.recruitStart;
    toBody.end = postOrigin.recruit.recruitEnd;
    toBody.terminate = 1;

    const res = await fetch(`/api/recruit/${postOrigin.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toBody)
    });

    if (res.status == 201) {
      console.log("모집이 종료되었습니다. isRecruiting:", false);
      // 서버에서 업데이트된 값을 다시 확인하려면 아래 코드를 통해 다시 fetch
      const updatedClub = await fetch(`/api/clubs/${postOrigin.id}`);
      const data = await updatedClub.json();
      console.log("서버에서 받아온 업데이트된 클럽 데이터:", data);
      console.log("isRecruiting 상태 확인:", data.isRecruiting);
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
    GetClub();
  }, []);

  

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 모집 공고 수정</h1>
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
          <p className={Styles.Left}>공고 제목</p>
          <div className={Styles.Right}>
            <input
              className={Styles.InputBox}
              placeholder='제목'
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
              disabled={IsAlwaysRecruiting}
              style={IsAlwaysRecruiting ? {color:'transparent'} : undefined}
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
              disabled={IsAlwaysRecruiting}
              style={IsAlwaysRecruiting ? {color: 'transparent'} : undefined}
              onChange={(e) => setRecruitEnd(e.target.value)}
            />
          </div>

          
            <p className={Styles.Left}>상시 모집</p>
              <input
                type='checkbox'
                id='AlwalysRecruiting'
                checked={IsAlwaysRecruiting}
                onChange={(e) => {
                  setIsAlwaysRecruit(e.target.checked);
                  if(e.target.checked) {
                    setRecruitStart(toStringByFormatting(new Date()));
                    setRecruitEnd('9999-12-31');
                  }else{
                    setRecruitStart(toStringByFormatting(new Date()));
                    setRecruitEnd(toStringByFormatting(new Date()));
                  }
                }}
              />
            

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
                placeholder='모집 공고 본문'
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </label>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>현재 이미지</p>
          <div className={Styles.Right}>
            <div className={Styles.ImageRoom}>
              <img className={Styles.ImageBoxColumn} src={currentSrc[currentImgSel]}/>
            </div>
            <div className={Styles.Side}>
              <div className={Styles.Images}>
                {
                  currentSrc.map((imgSrc, index) => {
                    return (
                      <div
                        className={Styles.ImageRoom}
                        style={index === currentImgSel ? {border: '1px solid #2D5DEB'} : null}
                        key={`cimg${index}`}
                      >
                        {
                          <img 
                            className={Styles.ImageSmallBox}
                            src={imgSrc}
                            onClick={(e) => setCurrentImgSel(index)}
                          />
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
          <p className={Styles.Left}>새 이미지</p>
          <div className={Styles.Right}>
            <div className={Styles.ImageRoom}>
              {
                imageSrcs[imageSelect] ?
                <img className={Styles.ImageBoxColumn} src={imageSrcs[imageSelect]}/> :
                <div className={Styles.ImageBoxColumn} />
              }
              <ul>
                <li>사진 미업로드 시 기존 이미지로 유지됩니다.</li>
                <li>번호를 누른 후 사진 1장을 업로드하면 이미지를<br/>변경할 수 있습니다.</li>
                <li>취소를 누르면 모든 이미지가 초기화 됩니다.</li>
                <li>한 장당 이미지 용량 제한: 5MB</li>
                <li>이미지 권장 비율: 3:4</li>
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
                      <div className={Styles.ImageRoom} key={`img${index}`}>
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
          <p className={Styles.Left}>주의 사항</p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li>도배, 욕설 등의 부적절한 글은 관리자에 의해 강제 삭제될 수 있습니다.</li>
            </ul>
          </div>
        </div>

        <button className={Styles.BlueButton} onClick={submitHandler}>
          수정 완료
        </button>

        <div className={Styles.ButtonContainer}>
          <button className={Styles.EndButton} onClick={endHandler}>
            모집 종료하기
          </button>

          <button className={Styles.CancelButton} onClick={deleteHandler}>
            공고 삭제하기
          </button>
        </div>
      </div>
    </div>
  )
}