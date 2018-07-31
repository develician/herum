import * as React from 'react';
import styles from './PageTemplate.scss';
import * as classNames from 'classnames/bind';
import HeaderContainer from 'containers/base/HeaderContainer';
// import Header from '../Header';

const cx = classNames.bind(styles);

// interface PageTemplateProps {

// }

const PageTemplate: React.SFC<{}> = ({ children }) => (
  <div className={cx('PageTemplate')}>
    <HeaderContainer />
    <main>{children}</main>
  </div>
);

export default PageTemplate;
