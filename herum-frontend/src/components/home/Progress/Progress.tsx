import * as React from 'react';
import styles from './Progress.scss';
import * as classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface ProgressProps {
  value: string;
  onPost(): void;
}

class Progress extends React.Component<ProgressProps> {
  public state = {
    percentage: 0,
  };

  public timeoutId;

  public handlePost = () => {
    const { onPost } = this.props;
    onPost();
  };

  public componentWillReceiveProps(nextProps: ProgressProps) {
    clearTimeout(this.timeoutId);

    this.setState({
      percentage: 0,
    });

    if (nextProps.value === '') {
      return;
    }

    setTimeout(
      () =>
        this.setState({
          percentage: 100,
        }),
      0
    );

    this.timeoutId = setTimeout(this.handlePost, 1000);
  }

  public render() {
    return (
      <div
        className={cx('Wrapper')}
        style={{
          width: `${this.state.percentage}%`,
          transition: this.state.percentage !== 0 ? 'all 1s ease-in-out' : 'none',
        }}
      />
    );
  }
}

export default Progress;
