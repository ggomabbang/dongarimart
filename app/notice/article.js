import Styles from './article.module.css';
import Link from "next/link"

export default function Article({title, date}) {
    return (
        <div className={Styles.ArticleBox}>
            <Link href={'/notice/' + 1}>
                <h1 className={Styles.ArticleTitle}>{title}</h1>
            </Link>
            <h3 className={Styles.Date}>{'-'+date}</h3>
        </div>
    )
}