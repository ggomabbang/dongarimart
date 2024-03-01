'use client';

import { useState, useEffect } from 'react';
import Styles from '@/app/component/inputPanel.module.css';
import { useRouter } from 'next/navigation'
import { mainCategory, subcategories } from '@/app/hooks/college'

export default function register() {
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

  const [clubName, setClubName] = useState("");
  const [oneLine, setOneLine] = useState("");
  const [url, setUrl] = useState("");
  const [short, setShort] = useState("");
  const [tags, setTags] = useState([]);

  const [department, setCollegeSelected] = useState("all");
  const [subDepartment, setSubDepartment] = useState("all");

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

    if (clubName == '') return alert('동아리 명을 입력해 주세요.');
    if (oneLine == '') return alert('한 줄 소개를 작성해 주세요.');
    if (department == 'all') return alert('소속 항목을 선택해 주세요');
    if (short == '') return alert('짧은 소개를 작성해 주세요.');

    let imagename = null;
    if (image) {
      const formData = new FormData();
      if (image instanceof File && image.size > 0)
        if (image.size > 5*1024*1024) return alert('5MB를 초과한 이미지가 있습니다.');
        formData.append("image", image);
      const imgRes = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      imagename = await imgRes.json();
    }

    const res = await fetch('/api/clubs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clubName,
        department: subDepartment === 'all' ? department : subDepartment,
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
    else if (res.status == 400) {
      const json = await res.json();
      if (json.message === '해당 parameter가 중복된 값입니다.'){
        return alert('이름이 중복된 동아리가 존재합니다.');
      } else {
        alert('요청 오류.');
        return router.push('/');
      }
    }
    else if (res.status == 401) {
      alert('로그인 후 다시 진행하여 주세요.');
      return router.push('/login');
    }
  }

  return(
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>동아리 등록</h1>

      <div className={Styles.Input}>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>동아리 명</p>
          <div className={Styles.Right}>
            <input 
              className={Styles.InputBox}
              placeholder='동아리 이름(필수)'
              value={clubName}
              onChange={(e)=>{
                if (e.target.value.length <= 20)
                  setClubName(e.target.value)
              }} 
              id='clubname'
            />
            <div className={Styles.FixedCount}>
              {`${clubName.length}/20`}
            </div>
          </div>
        </label>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}></p>
          <div className={Styles.Right}>
            <ul className={Styles.Caution}>
              <li>한번 지정한 동아리 이름은 변경할 수 없습니다.</li>
              <li>차후 변경이 필요한 경우, 삭제 후 다시 등록하거나 CONTACT 페이지를 참조해주세요</li>
            </ul>
          </div>
        </div>

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
              onChange={(e) => {setCollegeSelected(e.target.value); setSubDepartment('all')}} value={department}
            >
              <option value='all' key={-1} disabled>동아리 소속 선택</option>
              {
                Object.entries(mainCategory()).map(([key, value]) => {
                  if (key == 'all') return 
                  return (
                    <option value={key} key={key}>{value}</option>
                  )
                })
              }
            </select>
            <select
              className={Styles.MenuFont}
              onChange={(e) => setSubDepartment(e.target.value)} value={subDepartment}
            >
              <option value='all' key={-1} disabled>{mainCategory()[department]}</option>
              {
                Object.entries(subcategories(department)).map(([key, value]) => {
                  if (key == 'all') return 
                  return (
                    <option value={key} key={key}>{value}</option>
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

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>배너</p>
          <div className={Styles.Right}>
            <div className={Styles.ImageRoom}>
              {
                imageSrc.length ?
                <img className={Styles.ImageBox} src={imageSrc}/>
                :
                <div className={Styles.ImageBox}/>
              }
              <ul>
                <li>이미지 용량 제한: 5MB</li>
                <li>이미지 권장 비율: 4:3</li>
              </ul>
            </div>
            
            <div className={Styles.Buttons}>
              <label className={Styles.UploadButton}>
                업로드
                <input 
                  id="input-file"
                  type="file"
                  accept='image/png, image/jpeg'
                  style={{display: "none"}}
                  onChange={imageHandler}
                />
              </label>
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
        </div>
        
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
          등록
        </button>

      </div>
    </div>
  )
}