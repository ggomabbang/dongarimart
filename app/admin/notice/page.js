'use client';

import { useEffect, useState } from 'react';
import Styles from './recruit.module.css';
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
  };

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const submitHandler = async (e) => {
    const toBody = {
      title,
      content
    };

    if (toBody.title === '') return alert("제목이 필요합니다.");
    if (toBody.content === '') return alert("본문을 작성해 주세요.");

    if (images.length) {
      const formData = new FormData();
      images.forEach((img) => {
        if (img instanceof File && img.size > 0)
          formData.append("image", img);
      });
      const imgRes = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      const imagename = await imgRes.json();
      const imagenames = [];
      for (let i = 0; i < images.length; i++) imagenames.push(imagename[i]);
      toBody.image = imagenames;
    }
    
    const res = await fetch(`/api/posts/notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toBody)
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
    else if (res.status == 403) {
      alert('권한이 없습니다.');
      return router.push('/')
    }
  }

  return (
    <div className={Styles.Panel}>
      <h1 className={Styles.PageTitle}>공지사항 작성</h1>
      <div className={Styles.Input}>

        <label className={Styles.HorizonBox}>
          <p className={Styles.Left}>공지 제목</p>
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
          <p className={Styles.Left}>내용</p>
          <div className={Styles.Right}>
            <textarea 
              className={Styles.LargeInputBox}
              placeholder='모집 공고 본문'
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </label>

        <div className={Styles.HorizonBox}>
          <p className={Styles.Left}>이미지</p>
          <div className={Styles.ImageRoom}>
            <img className={Styles.ImageBox} src={imageSrcs[imageSelect]}/>
            <div>{imageSelect+1}</div>
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
                        <img 
                          className={Styles.ImageSmallBox}
                          src={imgSrc}
                          onClick={(e) => setImageSelect(index)}
                        /> :
                        <div className={Styles.ImageSmallBox} />
                      }
                      <div>{index+1}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        <button className={Styles.UploadButton} onClick={submitHandler}>
          완료
        </button>

      </div>
    </div>
  )
}