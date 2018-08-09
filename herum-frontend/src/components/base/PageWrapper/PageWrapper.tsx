import * as React from 'react';
import styles from './PageWrapper.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// interface PageWrapperProps {
  
// }

const PageWrapper: React.SFC<{}> = ({children}) => (
  <div className={cx('Wrapper')}>
    {children}
  </div>
);

export default PageWrapper;