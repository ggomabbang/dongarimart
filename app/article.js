import Styles from './article.module.css';

export default function Article({title, date}) {
    return (
        <div className={Styles.ArticleBox}>
            <text className={Styles.ArticleTitle}>{title}</text>
            <text className={Styles.Date}>{'-'+date}</text>
        </div>
    )
}