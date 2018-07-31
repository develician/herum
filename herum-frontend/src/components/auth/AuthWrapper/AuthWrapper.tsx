import * as React from 'react';
import styles from './AuthWrapper.scss';
import * as classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

// interface AuthWrapperProps {}

const AuthWrapper: React.SFC<{}> = ({ children }) => (
  <div className={cx('Positioner')}>
    <div className={cx('ShadowedBox')}>
      <div className={cx('LogoWrapper')}>
        <Link to={'/'} className={cx('Logo')}>
          Herum
        </Link>
      </div>
      <div className={cx('Contents')}>{children}</div>
    </div>
  </div>
);

export default AuthWrapper;
