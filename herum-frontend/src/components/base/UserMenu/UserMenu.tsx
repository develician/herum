import * as React from 'react';
import styles from './UserMenu.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// interface UserMenuProps {

// }

const UserMenu: React.SFC<{}> = ({ children }) => (
  <div className={cx('Positioner')}>
    <div className={cx('MenuWrapper')}>{children}</div>
  </div>
);

export default UserMenu;
