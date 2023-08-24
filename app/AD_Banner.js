export default function AD_Banner(){
    return (
      <div style={{marginLeft:'-2.8%'}}>
          <section class="ADBANNER" aria-label="Gallery">
          <ol class="viewport">
              <li id="slide1" tabindex="1" class="slide">
              <div class="snapper">
                  <a href="#slide3" class="prev"></a>
                  <a href="#slide2" class="next"></a>
              </div>
              </li>
              <li id="slide2" tabindex="2" class="slide">
              <div class="snapper">
                  <a href="#slide1" class="prev"></a>
                  <a href="#slide3" class="next"></a>
              </div>
              </li>
              <li id="slide3" tabindex="3" class="slide">
              <div class="snapper">
                  <a href="#slide2" class="prev"></a>
                  <a href="#slide1" class="next"></a>
              </div>
              </li>
          </ol>
          </section>
          <aside class="navigation">
            <ol class="navigation-list">
            <li class="navigation-item">
                <a href="#slide1" class="navigation-button">Go to slide 1</a>
            </li>
            <li class="navigation-item">
                <a href="#slide2" class="navigation-button">Go to slide 2</a>
            </li>
            <li class="navigation-item">
                <a href="#slide3" class="navigation-button">Go to slide 3</a>
            </li>
            </ol>
           </aside>
        </div>
    );
  }