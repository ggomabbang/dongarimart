'use client';

import { useState, useEffect } from 'react'
import Styles from '@/app/component/inputPanel.module.css'
import { useRouter } from 'next/navigation'
import College from '@/public/College.json'
import { raw } from '@/app/hooks/college'

export default function clubFix({ params }) {
  const clubid = params.id;

  const GetClub = async (id) => {
    const rows = await fetch('/api/clubs/'+id, {
      method: "GET"
    });
    if (rows.status == 200) {
      const data = await rows.json();
      setClubName(data.clubName);
      setOneLine(data.oneLine);
      setUrl(data.pageURL ? data.pageURL : '');
      setShort(data.short);
      setCollegeSelected(data.classification);
      setImgUrl(data.image ? data.image.filename : '');
      setTags(data.tags.map((obj, index) => {
        return obj.tagList.tagName
      }));
    } else {
      alert('동아리가 존재하지 않습니다. 다시 시도해 주십시오.')
      return router.push('/my');
    }
  }

  useEffect(() => {
    GetClub(clubid);
  }, []);

  const router = useRouter();

  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const imageHandler = async (e) => {
    setImage(e.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImageSrc(reader.result);
    }
    e.target.value = '';
  }

  const [delToggle, setDelToggle] = useState(false);

  const [clubName, setClubName] = useState("");
  const [oneLine, setOneLine] = useState("");
  const [url, setUrl] = useState("");
  const [short, setShort] = useState("");
  const [tags, setTags] = useState([]);
  const [imgUrl, setImgUrl] = useState("");

  const [department, setCollegeSelected] = useState("");

  const [tagValue, setTagValue] = useState("");

  const tagInputChange = (e) => {
    if (e.target.value.length <= 10)
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

    if (oneLine == '') return alert('한 줄 소개를 작성해 주세요.');
    if (short == '') return alert('짧은 소개를 작성해 주세요.');

    let imagename = null;
    if (image) {
      const formData = new FormData();
      if (image instanceof File && image.size > 0)
      if (image.size > 5*1024*1024) return alert('5MB를 초과한 이미지가 있습니다.')
        formData.append("image", image);
      const imgRes = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      imagename = await imgRes.json();
    }

    const res = await fetch(`/api/clubs/${clubid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oneLine,
        short,
        tags,
        url,
        image: imagename ? imagename[0] : null,
      }),
    });

    if (res.status == 201) {
      return router.push('/');
    }
    else if (res.status == 204) {
      alert('요청 오류. ID');
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
      alert('권한이 없습니다!');
      return router.push('/login');
    }
  }
  
  const deleteHandler = async (e) => {
    const rows = await fetch(`/api/clubs/${clubid}`, {
      method: "GET"
    });
    const data = await rows.json();

    if (data.clubName === document.getElementById('deleteName').value) {
      const res = await fetch(`/api/clubs/${clubid}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });

      switch (res.status) {
        case 200:
          return router.push('/');
        case 204:
          alert('요청 오류. ID');
          return router.push('/')    
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
    else {
      alert('이름이 일치하지 않습니다.');
    }
  }

  return(
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 수정</h1>
      <div className={Styles.Input}>
        
        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 명</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='동아리 이름(필수)'
              value={clubName}
              id='clubname'
              readOnly
            />
            <div className={Styles.FixedCount}>
              {`${clubName.length}/20`}
            </div>
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>한 줄 소개</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='한 줄 소개(필수)'
              value={oneLine}
              onChange={(e)=>{
                if (e.target.value.length <= 100)
                  setOneLine(e.target.value)
              }}
              id='short_inst' 
            />
            <div className={Styles.FixedCount}>
              {`${oneLine.length}/100`}
            </div>
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>홈페이지</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='인스타그램 등 동아리 소개 페이지 링크'
              value={url}
              onChange={(e)=>{
                if (e.target.value.length <= 255)
                  setUrl(e.target.value)
              }}
              id='url' 
            />
            <div className={Styles.FixedCount}>
              {`${url.length}/255`}
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

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>소속</p>
          <div className={Styles.Right}>
            <select
              className={Styles.MenuFont}
              onChange={(e) => setCollegeSelected(e.target.value)}
              value={department}
            >
              <option value='' key={-1} disabled>동아리 소속 선택</option>
              {
                Object.entries(raw()).map(([key, value]) => {
                  if (key != department) return 
                  return (
                    <option value={key} key={key} disabled>{value}</option>
                  )
                })
              }
            </select>
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>소개 글</p>
          <div className={Styles.Right}>
            <div className={Styles.InputWithCount}>
              <textarea 
                className={Styles.LargeInputBox}
                placeholder='동아리 소개 문구(필수)'
                value={short}
                onChange={(e)=>{
                  if (e.target.value.length <= 500)
                    setShort(e.target.value)
                }}
                id='inst'
              />
              <div className={Styles.Count}>
                {`${short.length}/500`}
              </div>
            </div>
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>현재 배너</p>
          <div className={Styles.Right}>
            <div className={Styles.ImageRoom}>
              {
                imgUrl.length ?
                <img className={Styles.ImageBox} src={`/api/image?filename=${imgUrl}`}/>
                :
                <div className={Styles.ImageBox}/>
              }
            </div>
          </div>
        </label>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>새 배너</p>
          <div className={Styles.Right}>
            <div className={Styles.ImageRoom}>
              {
                imageSrc.length ?
                <img className={Styles.ImageBox} src={imageSrc}/>
                :
                <div className={Styles.ImageBox}/>
              }
              <ul>
                <li>사진 미업로드 시 기존 배너로 유지됩니다.</li>
                <li>이미지 용량 제한: 5MB</li>
                <li>이미지 권장 비율: 4:3</li>
              </ul>
            </div>
            <div className={Styles.Buttons}>
              <label className={Styles.UploadButton} htmlFor='input-file'>
                업로드
              </label>
              <input 
                id="input-file"
                type="file"
                accept='image/png, image/jpeg'
                style={{display: "none"}}
                onChange={imageHandler}
              >
              </input>
              <button 
                className={Styles.CancelButton}
                onClick={(e) => {
                  setImage(null);
                  setImageSrc('');
                }}
              >
                취소
              </button>
            </div>
          </div>
        </label>
        
        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>태그</p>
          <div className={Styles.Right}>
            <div className={Styles.TagInput}>
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
            </div>
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
        </label>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>주의 사항</p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li>도배, 욕설 등의 부적절한 글은 관리자에 의해 강제 삭제될 수 있습니다.</li>
            </ul>
          </div>
        </div>

        <button className={Styles.BlueButton} onClick={handleSubmit}>
          수정 완료
        </button>
        
        {
          !delToggle ?
          <button
            className={Styles.CancelButton}
            onClick={(e)=>{
              setDelToggle(true);
            }}
          >
            동아리 삭제
          </button>
          :
          <div className={Styles.HorizonBox}>
            <p className={Styles.Left}>삭제</p>
            <div className={Styles.Right}>
              <input
                id='deleteName'
                className={Styles.InputBox}
                placeholder='동아리 이름을 똑같이 입력해 주세요'
              />
              <div className={Styles.Buttons}>
                <button
                  className={Styles.UploadButton}
                  onClick={(e)=>{setDelToggle(false)}}
                >
                  삭제 취소
                </button>
                <button
                  className={Styles.CancelButton}
                  onClick={deleteHandler}
                >
                  삭제 확인
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}