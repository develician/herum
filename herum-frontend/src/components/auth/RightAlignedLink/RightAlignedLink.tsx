import * as React from 'react';
import styles from './RightAlignedLink.scss';
import * as classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

interface RightAlignedLinkProps {
  to: string;
}

const RightAlignedLink: React.SFC<RightAlignedLinkProps> = ({ to, children }) => (
  <div className={cx('Aligner')}>
    <Link to={to} className={cx('StyledLink')}>
      {children}
    </Link>
  </div>
);

export default RightAlignedLink;
