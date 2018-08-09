import * as React from 'react';
import styles from './UserThumbnail.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface UserThumbnailProps {
  thumbnail?: string;
  image?: string;
  onClick?(): void;
}

const UserThumbnail: React.SFC<UserThumbnailProps> = ({ thumbnail, onClick, image }) => (
  <div
    className={cx('Wrapper')}
    style={{ backgroundImage: `url(${thumbnail})` }}
    onClick={onClick}
  />
);

export default UserThumbnail;
