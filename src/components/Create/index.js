import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

export default function Create() {
  const Svg1 =
    require("@site/static/img/undraw_code_typing_re_p8b9.svg").default;
  const Svg2 =
    require("@site/static/img/undraw_share_link_re_54rx.svg").default;
  const Svg3 =
    require("@site/static/img/undraw_click_here_re_y6uq.svg").default;

  return (
    <>
      <div className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">创造更多</h1>
          <p className="hero__subtitle">
            通过自定义接口，创造各种实验情境，通过文件分享你的设计
          </p>
          <div style={{ marginBottom: 40 }}>
            <Link
              className="button button--secondary button--lg"
              to="docs/docs/intro"
            >
              文档
            </Link>
            <span style={{ margin: 20 }} />
            <Link
              className="button button--secondary button--lg"
              to="docs/share/intro"
            >
              集锦
            </Link>
          </div>
          <div className={clsx("col col--12", styles.icons)}>
            <Svg1 className={styles.featureSvg} role="img" />
            <Svg2 className={styles.featureSvg} role="img" />
            <Svg3 className={styles.featureSvg} role="img" />
          </div>
        </div>
      </div>
    </>
  );
}
