export default function AD_Banner(){
    return (
      <div style={{marginLeft:'-2.8%'}}>
          <section className="ADBANNER" aria-label="Gallery">
          <ol className="viewport">
              <li id="slide1" tabIndex="1" className="slide">
              <div className="snapper">
                  <a href="#slide3" className="prev"></a>
                  <a href="#slide2" className="next"></a>
              </div>
              </li>
              <li id="slide2" tabIndex="2" className="slide">
              <div className="snapper">
                  <a href="#slide1" className="prev"></a>
                  <a href="#slide3" className="next"></a>
              </div>
              </li>
              <li id="slide3" tabIndex="3" className="slide">
              <div className="snapper">
                  <a href="#slide2" className="prev"></a>
                  <a href="#slide1" className="next"></a>
              </div>
              </li>
          </ol>
          </section>
          <aside className="navigation">
            <ol className="navigation-list">
            <li className="navigation-item">
                <a href="#slide1" className="navigation-button">Go to slide 1</a>
            </li>
            <li className="navigation-item">
                <a href="#slide2" className="navigation-button">Go to slide 2</a>
            </li>
            <li className="navigation-item">
                <a href="#slide3" className="navigation-button">Go to slide 3</a>
            </li>
            </ol>
           </aside>
        </div>
    );
  }