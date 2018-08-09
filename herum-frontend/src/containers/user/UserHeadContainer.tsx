import * as React from 'react';
import { connect } from 'react-redux';
import UserHead from 'components/user/UserHead';
import { userPageActions } from 'store/modules/userPage';
import { bindActionCreators } from 'redux';
import { State } from 'store/modules';
// import { withRouter } from 'react-router-dom';

export interface UserHeadContainerProps {
  UserPageActions: typeof userPageActions;
  thumbnail: string;
  thoughtCount: number;
  fetched: any;
}

export interface OwnProps {
  username: string;
}

class UserHeadContainer extends React.Component<UserHeadContainerProps & OwnProps> {
  public getUserInfo = async () => {
    const { UserPageActions, username } = this.props;

    try {
      UserPageActions.getUserInfo(username);
    } catch (e) {
      console.log(e);
    }
  };

  public componentDidMount() {
    this.getUserInfo();
  }

  public componentDidUpdate(prevProps: OwnProps, prevState) {
    if (prevProps.username !== this.props.username) {
      this.getUserInfo();
    }
  }
  public render() {
    if (!this.props.fetched) {
      return null;
    }
    return (
      <UserHead
        username={this.props.username}
        image={this.props.thumbnail}
        thoughtCount={this.props.thoughtCount}
      />
    );
  }
}

export default connect(
  ({ userPage, pender }: State) => ({
    thumbnail: userPage.userInfo.profile.thumbnail,
    thoughtCount: userPage.userInfo.thoughtCount,
    fetched: pender.success['userPage/GET_USER_INFO'],
  }),
  dispatch => ({
    UserPageActions: bindActionCreators(userPageActions, dispatch),
  })
)(UserHeadContainer);

// export default compose(
//    withRouter,
//    connect(
//       ({ }: State) => ({
//       }),
//       dispatch => ({
//           UserPageActions: bindActionCreators(userPageActions, dispatch)
//       })
//    )
// )(UserHeadContainer)
