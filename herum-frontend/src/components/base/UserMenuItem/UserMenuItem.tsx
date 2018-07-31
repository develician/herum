import * as React from 'react';
import styles from './UserMenuItem.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface UserMenuItemProps {
  onClick?(): void;
}

const UserMenuItem: React.SFC<UserMenuItemProps> = ({ children, onClick }) => (
  <div className={cx('MenuItem')} onClick={onClick}>
    {children}
  </div>
);

export default UserMenuItem;
