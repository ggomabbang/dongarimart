'use client'

import Styles from './oneArticle.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function oneArticle({ params }) {
  const articleid = params.id

  const [ article, setArticle ] = useState({
    title: '로딩 중',
    content: '...',
    updatedAt: '...',
    image: [],
  });

  const getArticle = async () => {
    const res = await fetch(`/api/posts/${articleid}`, {
      method: 'GET',
    });
    if (res.status == 200) {
      const json = await res.json();
      setArticle(json);
    }
  }

  useEffect(() => {
    getArticle();
  }, []);

  return (
    <div className={Styles.Container}>
      <h1 className={Styles.PageTitle}>공지사항 📢</h1>
      <div className={Styles.Panel}>
        <div className={Styles.Top}>
          <Link href={'/notice'}>
            <p className={Styles.GoBack}>&lt; 뒤로가기</p>
          </Link>
          <h1 className={Styles.Title}>{article.title}</h1>
          <h4 className={Styles.Date}>{article.updatedAt.slice(0, 10)}</h4>
          <div className={Styles.line}/>
        </div>
        <div className={Styles.Bottom}>
          <div className={Styles.Contents}>
            {
              article.content.split('\n').map((line, index) => {
                return (
                  <span key={`content${index}`}>
                    {line}
                    <br />
                  </span>
                )
              })
            }
          </div>
          {
            article.image.map((img, index) => {
              return (
                <img src={`/api/image?filename=${img.filename}`} key={index} />
              )
            })
          }
        </div>
      </div>
      
    </div>
  )
}