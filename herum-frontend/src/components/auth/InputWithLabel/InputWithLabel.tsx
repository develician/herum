import * as React from 'react';
import styles from './InputWithLabel.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface InputWithLabelProps {
  value?: string;
  label: string;
  name?: string;
  placeholder?: string;
  type?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  onKeyPress?(e: React.KeyboardEvent): void;
}

const InputWithLabel: React.SFC<InputWithLabelProps> = ({ label, ...rest }) => (
  <div className={cx('Wrapper')}>
    <div className={cx('Label')}>{label}</div>
    <input className={cx('Input')} {...rest} />
  </div>
);

export default InputWithLabel;
