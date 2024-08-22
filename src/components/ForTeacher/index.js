import clsx from "clsx";
import styles from "./styles.module.css";
import Slider from "react-slick";

import { MdOutlineAdsClick } from "react-icons/md";
import {
  FaChalkboardTeacher,
  FaExpandArrowsAlt,
  FaRegLightbulb,
} from "react-icons/fa";
import { RiTimerFlashLine } from "react-icons/ri";

const FeatureList = [
  {
    title: "教室白板适配",
    icon: <FaChalkboardTeacher size={50} />,
    description: (
      <>
        适配多种教室白板，支持触控操作，可供课堂演示使用
        <br />
        所有触控均位于屏幕下方，轻松操控
      </>
    ),
    direction: "left",
  },
  {
    title: "即点即用",
    icon: <MdOutlineAdsClick size={50} />,
    description: (
      <>无需安装，即点即用。带上EXE程序，复制到U盘，插入教室电脑，即可使用</>
    ),
    direction: "right",
  },
  {
    title: "屏幕自适应",
    icon: <FaExpandArrowsAlt size={50} />,
    description: (
      <>
        对于不同大小的屏幕自适应组件布局，适用于不同设备
        <br />
        兼顾实验课、公开课、讲座、面对面演示等多种场景
      </>
    ),
    direction: "left",
  },
  {
    title: "备课功能",
    icon: <RiTimerFlashLine size={50} />,
    description: (
      <>通过配置导入导出功能，支持提前备课，在课上一键切换，提高效率</>
    ),
    direction: "right",
  },
  {
    title: "关灯模式",
    icon: <FaRegLightbulb size={50} />,
    description: <>一键关灯，进入高对比度模式，展示别样精彩</>,
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
            <b className={clsx(styles.nomargin)}>{title}</b>
          </div>
        </div>
      )}
      <div className={clsx("col col--8", styles.rightbox)}>
        <p className={clsx(styles.nomargin)}> {description}</p>
      </div>
      {direction === "right" && (
        <div className={clsx("col col--4", styles.rightbox)}>
          <div>{icon}</div>
          <div className="text--center padding-horiz--md">
            <b className={clsx(styles.nomargin)}>{title}</b>
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
          <p className="hero__subtitle">
            以教室教学为第一设计场景，为教师量身打造优良交互体验
          </p>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </>
  );
}
