import clsx from "clsx";
import styles from "./styles.module.css";
import Slider from "react-slick";

export default function MoreIMG() {
  const imgs = [
    "img/social.png",
    "img/docusaurus.png",
    "img/undraw_docusaurus_tree.svg",
    "img/undraw_docusaurus_react.svg",
    "img/undraw_docusaurus_mountain.svg",
  ];
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
              <img key={i} height={500} src={img} alt="test" />
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
