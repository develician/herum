import * as React from 'react';
import styles from './AuthContent.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface AuthContentProps {
  title: string;
}

const AuthContent: React.SFC<AuthContentProps> = ({ title, children }) => (
  <div>
    <div className={cx('Title')}>{title}</div>
    {children}
  </div>
);

export default AuthContent;
