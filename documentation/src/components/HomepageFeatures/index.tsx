import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_file_bundle_re_6q1e.svg').default,
    description: (
      <>
        Grab our KMEHR XML files now and start your assessment right now
      </>
    ),
  },
  {
    title: 'Interoperability',
    Svg: require('@site/static/img/undraw_split_testing_l1uw.svg').default,
    description: (
      <>
        Ensure smooth communication and functionality across platforms
      </>
    ),
  },
  {
    title: 'Homologation',
    Svg: require('@site/static/img/undraw_certification_re_ifll.svg').default,
    description: (
      <>
        Ensure your product is certified to meet industry standards, guaranteeing compliance
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
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