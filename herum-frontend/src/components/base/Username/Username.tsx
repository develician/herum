import * as React from 'react';
import styles from './Username.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface UsernameProps {
  username: string;
}

const Username: React.SFC<UsernameProps> = ({ username }) => (
  <div className={cx('Wrapper')}>@{username}</div>
);

export default Username;
