import Styles from './AD_Banner.module.css';

export default function AD_Banner(){
    return (
        <div className={Styles.ADBox} style={{display:'none'}}>
            <aside className={Styles.navigation}>
                <ol className={Styles.navigation_list}>
                    <li className={Styles.navigation_item}>
                        <a href="#slide1" className={Styles.navigation_button}>Go to slide 1</a>
                    </li>
                    <li className={Styles.navigation_item}>
                        <a href="#slide2" className={Styles.navigation_button}>Go to slide 2</a>
                    </li>
                    <li className={Styles.navigation_item}>
                        <a href="#slide3" className={Styles.navigation_button}>Go to slide 3</a>
                    </li>
                </ol>
            </aside>
            <section className={Styles.ADBANNER} aria-label="Gallery">
                <ol className={Styles.viewport}>
                    <li id="slide1" tabIndex="1" className={Styles.slide}>
                    <div className={Styles.snapper}>
                        <a href="#slide3" className={Styles.prev}></a>
                        <a href="#slide2" className={Styles.next}></a>
                    </div>
                    </li>
                    <li id="slide2" tabIndex="2" className={Styles.slide}>
                    <div className={Styles.snapper}>
                        <a href="#slide1" className={Styles.prev}></a>
                        <a href="#slide3" className={Styles.next}></a>
                    </div>
                    </li>
                    <li id="slide3" tabIndex="3" className={Styles.slide}>
                    <div className={Styles.snapper}>
                        <a href="#slide2" className={Styles.prev}></a>
                        <a href="#slide1" className={Styles.next}></a>
                    </div>
                    </li>
                </ol>
            </section>
        </div>
    );
  }