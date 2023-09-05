import Article from './article';
import Styles from './notice.module.css';

export default function notice() {
    let Data = [
        {
            'title': '23년 3분기 악성 이용자 제제내역',
            'date': '23/08/22',
        },
        {
            'title': '올해 최고의 동아리를 뽑아봤습니다!',
            'date': '23/06/15',
        },
        {
            'title': '6409에 폭발물 설치한 20대 A씨, 올해의 시민상..',
            'date': '23/09/05',
        },
    ];

    return (
        <div className={Styles.NoticeBox}>
            <div className={Styles.Top}>
                <text className={Styles.Title}>공지사항 📢</text>
                <button className={Styles.MoreButton}>+ 더보기</button>
            </div>
            <div className={Styles.Articles}>
                {
                    Data.map((article, index) => {
                        return (
                            <Article 
                                title={article.title} 
                                date={article.date} 
                                key={index}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}