import * as React from 'react';
import styles from './LoginButton.scss';
import * as classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

// interface LoginButtonProps {}

const LoginButton: React.SFC<{}> = () => (
  <Link to={'/auth/login'} className={cx('BorderedButton')}>
    로그인 / 가입
  </Link>
);

export default LoginButton;
