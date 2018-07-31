import * as React from 'react';
import styles from './Header.scss';
import * as classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

// interface HeaderProps {}

const Header: React.SFC<{}> = ({ children }) => (
  <div className={cx('Positioner')}>
    <div className={cx('WhiteBackground')}>
      <div className={cx('HeaderContents')}>
        <Link to={'/'} className={cx('Logo')}>
          HERUM
        </Link>
        <div className={cx('Spacer')} />
        {children}
      </div>
    </div>
    <div className={cx('GradientBorder')} />
  </div>
);

export default Header;
