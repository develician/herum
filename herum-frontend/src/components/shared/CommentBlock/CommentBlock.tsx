import * as React from 'react';
import styles from './CommentBlock.scss';
import * as classNames from 'classnames/bind';
import { Comment } from 'store/modules/posts';
import CommentList from '../CommentList';

const cx = classNames.bind(styles);

interface CommentBlockProps {
  value?: string;
  visible?: boolean;
  comments?: Comment[];
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  onKeyPress?(e: React.KeyboardEvent): void;
  onRelayout?(): void;
}

const CommentBlock: React.SFC<CommentBlockProps> = ({
  value,
  visible,
  onChange,
  onKeyPress,
  comments,
  onRelayout,
}) => {
  if (visible) {
    return (
      <div className={cx('Wrapper')}>
        <div className={cx('InputWrapper')}>
          <input
            className={cx('Input')}
            placeholder="덧글을 입력 후 [Enter] 를 눌러 작성하세요"
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          {comments && <CommentList comments={comments} onRelayout={onRelayout} />}
        </div>
      </div>
    );
  }
  return null;
};

export default CommentBlock;
