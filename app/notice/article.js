import Styles from './article.module.css';

export default function Article({title, date}) {
    return (
        <div className={Styles.ArticleBox}>
            <h1 className={Styles.ArticleTitle}>{title}</h1>
            <h3 className={Styles.Date}>{'-'+date}</h3>
        </div>
    )
}