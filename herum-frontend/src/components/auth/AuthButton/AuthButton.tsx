import * as React from 'react';
import styles from './AuthButton.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface AuthButtonProps {
  onClick?(): void;
}

const AuthButton: React.SFC<AuthButtonProps> = ({ onClick, children }) => (
  <div className={cx('Wrapper')} onClick={onClick}>
    {children}
  </div>
);

export default AuthButton;
