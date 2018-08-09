import * as React from 'react';
import styles from './UserHead.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface UserHeadProps {
  image?: string;
  username?: string;
  thoughtCount?: number;
}

const UserHead: React.SFC<UserHeadProps> = ({
  image = '/static/images/default_thumbnail.png',
  username = 'username',
  thoughtCount = 150,
}) => (
  <div className={cx('Wrapper')}>
    <div className={cx('Thumbnail')} style={{ backgroundImage: `url(${image})` }} />
    <div className={cx('Username')}>{username}</div>
    <div className={cx('Count')}>
      흐른생각 <b>{thoughtCount}</b>개
    </div>
  </div>
);

export default UserHead;
