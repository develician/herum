import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { homeActions } from 'store/modules/home';
import { State } from 'store/modules';
import { withRouter } from 'react-router-dom';
import WritePost from 'components/home/WritePost';
import { toast } from 'react-toastify';

export interface WritePostContainerProps {
  HomeActions: typeof homeActions;
  value: string;
}

class WritePostContainer extends React.Component<WritePostContainerProps> {


  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { HomeActions } = this.props;
    HomeActions.changeWritePostInput({ value: e.target.value });
  };

  public handlePost = async (): Promise<any> => {

    
    const { HomeActions } = this.props;

    const toastMessage = (message: string) => <div style={{ fontSize: '1.1rem' }}>{message}</div>;

    if (this.props.value.length < 5) {
      HomeActions.changeWritePostInput({ value: '' });
      return toast(toastMessage('너무 짧습니다. 5자 이상 입력하세요.'), { type: 'error' });
    }
    if (this.props.value.length > 1000) {
      HomeActions.changeWritePostInput({ value: '' });
      return toast(toastMessage('최대 1000자 까지 입력할수 있습니다.'), { type: 'error' });
    }

    try {
      await HomeActions.writePost({ content: this.props.value });
      toast(toastMessage('생각이 작성되었습니다.'), { type: 'success' });
    } catch (e) {
      toast(toastMessage('오류가 발생했습니다.'), { type: 'error' });
    }
  };

  

  public render() {
    return (
      <WritePost
        value={this.props.value}
        onChange={this.handleChange}
        onPost={this.handlePost}
      />
    );
  }
}

// export default WritePostContainer;

export default compose(
  withRouter,
  connect(
    ({ home }: State) => ({
      value: home.writePost.value,
    }),
    dispatch => ({
      HomeActions: bindActionCreators(homeActions, dispatch),
    })
  )
)(WritePostContainer);
