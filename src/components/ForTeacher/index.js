import clsx from "clsx";
import styles from "./styles.module.css";
import Slider from "react-slick";
import Heading from "@theme/Heading";

import { MdOutlineAdsClick } from "react-icons/md";

const FeatureList = [
  {
    title: "教室白板适配",
    icon: <MdOutlineAdsClick size={50} />,
    description: <>适配多种教室白板，支持触控操作</>,
    direction: "left",
  },
  {
    title: "即点即用",
    icon: <MdOutlineAdsClick size={50} />,
    description: (
      <>无需安装，即点即用。带上EXE程序，辅助到U盘，插入教室电脑，即可使用。</>
    ),
    direction: "right",
  },
  {
    title: "屏幕自适应",
    icon: <MdOutlineAdsClick size={50} />,
    description: (
      <>
        对于不同大小的屏幕自适应组件布局，适用于不同设备，兼顾实验课、公开课、讲座、面对面演示等多种场景
      </>
    ),
    direction: "left",
  },
];

function Feature({ icon, title, description, direction }) {
  return (
    <div
      className={clsx(
        "container item shadow--md row col col--12",
        styles.features
      )}
    >
      {direction === "left" && (
        <div className={clsx("col col--4", styles.rightbox)}>
          <div>{icon}</div>
          <div className="text--center padding-horiz--md">
            <Heading as="h3">{title}</Heading>
          </div>
        </div>
      )}
      <div className={clsx("col col--8", styles.rightbox)}>
        <p> {description}</p>
      </div>
      {direction === "right" && (
        <div className={clsx("col col--4", styles.rightbox)}>
          <div>{icon}</div>
          <div className="text--center padding-horiz--md">
            <Heading as="h3">{title}</Heading>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ForTeacher() {
  return (
    <>
      <div className={clsx("hero", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">为一线教师打造</h1>
          <p className="hero__subtitle">Not all heroes wear capes</p>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </>
  );
}
