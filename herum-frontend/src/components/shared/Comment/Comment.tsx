import * as React from 'react';
import styles from './Comment.scss';
import * as classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

interface CommentProps {
  username: string;
  text: string;
  key?: string;
}

const Comment: React.SFC<CommentProps> = ({ username, text }) => (
  <div className={cx('CommentWrapper')}>
    <Link to={`/@${username}`} className={cx('User')}>
      {username}
    </Link>
    <div className={cx('Text')}>{text}</div>
  </div>
);

export default Comment;
