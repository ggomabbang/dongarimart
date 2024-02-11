import Styles from './article.module.css';
import Link from "next/link"

export default function article({title, date}) {
    return (
        <Link href={'/notice/' + 1} className={Styles.ArticleBox}>
            <h1 className={Styles.ArticleTitle}>{title}</h1>
            <h3 className={Styles.Date}>{date}</h3>
        </Link>
    )
}