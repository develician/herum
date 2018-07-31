import * as React from 'react';
import styles from './AuthError.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// interface AuthErrorProps {

// }

const AuthError: React.SFC<{}> = ({ children }) => <div className={cx('Wrapper')}>{children}</div>;

export default AuthError;
