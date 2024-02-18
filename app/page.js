'use client'

import College from '@/public/College.json'
import Styles from './page.module.css'
import Link from "next/link"
import Notice from './notice/notice'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function home() {
  const { status } = useSession();
  const [ clubs, setClubs ] = useState([]);

  const getClubs = async () => {
    const urlParams = new URLSearchParams('');
    urlParams.append('sortBy', 'popularity');
    urlParams.append('pagination', 4);

    const res = await fetch('/api/clubs?' + urlParams.toString(), {
      method: 'GET'
    });
    const json = await res.json();
    setClubs(json);
  }

  useEffect(() => {
    getClubs();
  }, []);
  return (
    <div className={Styles.Content}>

      <div className={Styles.MainButton}>
        <div className={Styles.Top}>
          <h1 className={Styles.Title}>동아리 목록을 둘러보세요</h1>
        </div>
        <div className={Styles.FindBlock}>
          <Link href={'/find'} className={Styles.FindElement}>
            <button>더 찾아보기</button>
          </Link>
          {
            clubs.map((club, index) => {
              return (
                <Link href={`/club/${club.id}`} className={Styles.FindElement} key={`club${index}`}>
                  <div className={Styles.ClubMini}>
                    <h3>{club.clubName}</h3>
                    <span>{club.oneLine}</span>
                    <div className={Styles.ClubTags}>
                      {
                        club.tags.map((t, index) => {
                          return (
                            <h4 className={Styles.Tag} key={`t${index}`}>{t.tagList.tagName}</h4>
                          )
                        })
                      }
                    </div>
                    
                    <h4 className={Styles.Tag}>{College[club.classification]}</h4>
                  </div>
                </Link>
              )

            })
          }
        </div>
      </div>

      <div className={Styles.MainButton}>
        <div className={Styles.Top}>
          {
            status === 'authenticated' ?
            <h1 className={Styles.Title}>더 많은 기능 살펴보기</h1> : null
          }
          {
            status === 'unauthenticated' ?
            <h1 className={Styles.Title}>로그인으로 더 많은 기능 이용하기</h1> : null
          }
        </div>
        
          {
            status === 'authenticated' ?
              <div className={Styles.FindBlock}>
                <Link href={'/register'} className={Styles.FxElement}>
                  <button>
                    동아리 등록
                  </button>
                </Link>
                <Link href={'/recruit'} className={Styles.FxElement}>
                  <button>
                    인원 모집
                  </button>
                </Link>
              </div> : null
          }
          {
            status === 'unauthenticated' ?
              <div className={Styles.FindBlock}>
                <Link href={'/login/signup'} className={Styles.FxElement}>
                  <button>
                    회원가입
                  </button>
                </Link>
                <Link href={'/login'} className={Styles.FxElement}>
                  <button>
                    로그인
                  </button>
                </Link>
              </div> : null
          }
      </div>
        
      <Notice/>
    </div>
  );
}