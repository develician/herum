import * as React from 'react';
import styles from './WritePost.scss';
import * as classNames from 'classnames/bind';
import Textarea from 'react-textarea-autosize';
import Progress from '../Progress';

const cx = classNames.bind(styles);

interface WritePostProps {
  value: string;

  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  onPost(): void;
}

const WritePost: React.SFC<WritePostProps> = ({ value, onChange, onPost }) => {
  const preventPaste = e => {
    e.preventDefault();
  };

  return (
    <div className={cx('Wrapper')}>
      <Textarea
        value={value}
        onChange={onChange}
        className={cx('StyledTextArea')}
        minRows={3}
        maxRows={10}
        placeholder={`의식의 흐름대로 당신의 생각을 적어보세요.\n5초이상 아무것도 입력하지 않으면 자동으로 포스팅됩니다.`}
        onPaste={preventPaste}
      />
      <Progress onPost={onPost} value={value} />
    </div>
  );
};

export default WritePost;
