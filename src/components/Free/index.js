import clsx from "clsx";
import styles from "./styles.module.css";
import myImageUrl from "@site/static/img/qq.png";

import { MdOutlineAdsClick } from "react-icons/md";

export default function Free() {
  return (
    <>
      <div className={clsx("hero", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">开源，免费，提供支持</h1>
          <p className="hero__subtitle">
            免费，无版权纠纷，放心使用，需要支持请加入QQ群
            <br />
            已帮助老师同学完成多项竞赛获奖
          </p>
          <img
            src={myImageUrl}
            height={300}
            width={300}
            id="qrcode"
            alt="QR Code"
          />
          <p>扫码加入QQ群</p>
        </div>
      </div>
    </>
  );
}
