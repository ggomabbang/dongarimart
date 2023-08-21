import './lab.css'

export default function Home() {
  return (
    <div>
        <section class="carousel" aria-label="Gallery">
        <ol class="viewport">
            <li id="slide1" tabindex="0" class="slide">
            <div class="napper">
                <a href="#slide4" class="prev"></a>
                <a href="#slide2" class="cnext"></a>
            </div>
            </li>
            <li id="slide2" tabindex="1" class="slide">
            <div class="snapper">
                <a href="#slide1" class="prev"></a>
                <a href="#slide3" class="next"></a>
            </div>
            </li>
            <li id="slide3" tabindex="2" class="slide">
            <div class="snapper">
                <a href="#slide2" class="prev"></a>
                <a href="#slide4" class="next"></a>
            </div>
            </li>
            <li id="slide4" tabindex="3" class="slide">
            <div class="snapper">
                <a href="#slide3" class="prev"></a>
                <a href="#slide1" class="next"></a>
            </div>
            </li>
        </ol>
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
            <li class="navigation-item">
                <a href="#slide4" class="navigation-button">Go to slide 4</a>
            </li>
            </ol>
        </aside>
        </section>
        </div>
  )
}