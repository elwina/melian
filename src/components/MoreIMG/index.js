import clsx from "clsx";
import styles from "./styles.module.css";
import Slider from "react-slick";

import imageUrl1 from "@site/static/img/highlights/highlight1.png";
import imageUrl2 from "@site/static/img/highlights/highlight2.png";
import imageUrl3 from "@site/static/img/highlights/highlight3.png";
import imageUrl4 from "@site/static/img/highlights/highlight4.png";

export default function MoreIMG() {
  const imgs = [imageUrl1, imageUrl2, imageUrl3, imageUrl4];
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <>
      <div className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">精彩图样</h1>
          <p className="hero__subtitle">Not all heroes wear capes</p>
          <Slider {...settings}>
            {imgs.map((img, i) => (
              <img key={img} src={img} alt="test" />
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
