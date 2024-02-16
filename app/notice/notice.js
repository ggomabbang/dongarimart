'use client'

import Article from './article'
import Styles from './notice.module.css'
import Link from "next/link"
import { useState, useEffect } from "react"

export default function notice({more}) {
    const [ articles, setArticles ] = useState([]);

    const getArticles = async () => {
        const res = await fetch('/api/posts/notice', {
            method: 'GET',
        });
        if (res.status == 200) {
            const json = await res.json();
            setArticles(json);
        }
    }

    useEffect(() => {
        getArticles();
    }, [])

    return (
        <div className={Styles.NoticeBox}>
            <div className={Styles.Top}>
                <h1 className={Styles.Title}>공지사항 📢</h1>
                <Link href={'/notice'} style={{display: more}}>
                    <button className={Styles.MoreButton}>+ 더보기</button>                    
                </Link>
            </div>
            <div className={Styles.Articles}>
                {
                    articles.length ?
                    articles.map((article, index) => {
                        return (
                            <Article
                                id={article.id}
                                title={article.title} 
                                date={article.updatedAt.slice(0,10)} 
                                key={index}
                            />
                        );
                    }) :
                    <div className={Styles.Null}>글이 존재하지 않습니다.</div>
                }
            </div>
        </div>
    );
}