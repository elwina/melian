import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import Heading from "@theme/Heading";
import styles from "./index.module.css";
import MoreIMG from "@site/src/components/MoreIMG";
import ForTeacher from "@site/src/components/ForTeacher";
import Create from "../components/Create";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          height={300}
          width={300}
          style={{
            marginBottom: 50,
          }}
          src="/img/logo.svg"
          alt="logo"
        />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://melian.elwina.work/"
          >
            网页版体验
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={"首页"} description="波动光学演示系统主页">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <MoreIMG />
        <ForTeacher />
        <Create />
      </main>
    </Layout>
  );
}
