import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

import { MdOutlineAdsClick } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { IoColorFilterSharp } from "react-icons/io5";
import { AiFillApi } from "react-icons/ai";
import { FaStopwatch } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa6";

const FeatureList = [
  {
    title: "即点即用",
    icon: <MdOutlineAdsClick size={50} />,
    description: (
      <>无需安装，即点即用。带上这个EXE程序，插入到教室电脑，即可使用</>
    ),
  },
  {
    title: "教学优先",
    icon: <GiTeacher size={50} />,
    description: <>软件的第一服务对象是教师。我们致力于提供最好的教学体验</>,
  },
  {
    title: "科学性强",
    icon: <IoColorFilterSharp size={50} />,
    description: <>自主研发复色光模拟算法，最大程度还原真实实验</>,
  },
  {
    title: "开放接口",
    icon: <AiFillApi size={50} />,
    description: <>软件提供开放接口，可以自主模拟各类光学实验，创造可能</>,
  },
  {
    title: "动态交互",
    icon: <FaStopwatch size={50} />,
    description: (
      <>基于前端最新WASM技术，做到毫秒级响应的程序运行速度，提供动态交互体验</>
    ),
  },
  {
    title: "开源免费",
    icon: <FaLockOpen size={50} />,
    description: <>本软件是开源免费的，欢迎大家使用、分享</>,
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">{icon}</div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
