'use client'

import College from '@/public/College.json'
import { raw } from '@/app/hooks/college'
import Styles from './page.module.css'
import Link from "next/link"
import Notice from './notice/page'
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
    setClubs(json.clubList);
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
          <Link href={'/find'} className={Styles.FindMore}>
            더 찾아보기
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
                    
                    <h4 className={Styles.Tag}>{raw()[club.classification]}</h4>
                  </div>
                </Link>
              )

            })
          }
        </div>
        <Link href={'/find'} className={Styles.More}>동아리 더 찾아보기</Link>
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
                동아리 등록
              </Link>
              <Link href={'/recruit'} className={Styles.FxElement}>
                인원 모집
              </Link>
            </div> : null
        }
        {
          status === 'unauthenticated' ?
            <div className={Styles.FindBlock}>
              <Link href={'/login/signup'} className={Styles.FxElement}>
                회원가입
              </Link>
              <Link href={'/login'} className={Styles.FxElement}>
                로그인
              </Link>
            </div> : null
        }
      </div>
        
      <Notice more={true} />
    </div>
  );
}