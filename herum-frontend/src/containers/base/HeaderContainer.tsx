import * as React from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { State } from 'store/modules';
import { userActions } from 'store/modules/user';
import { baseActions } from 'store/modules/base';
import { withRouter } from 'react-router-dom';
import Header from 'components/base/Header';
import LoginButton from 'components/base/LoginButton';
import UserThumbnail from 'components/base/UserThumbnail';
import UserMenuContainer from 'containers/base/UserMenuContainer';

export interface HeaderContainerProps {
  UserActions: typeof userActions;
  BaseActions: typeof baseActions;
  visible: boolean;
  logged: boolean;
  username: string;
  thumbnail: string;
}

class HeaderContainer extends React.Component<HeaderContainerProps> {
  public handleThumbnailClick = () => {
    const { BaseActions } = this.props;
    BaseActions.setUserMenuVisibility(true);
  };

  public render() {
    if (!this.props.visible) {
      return null;
    }
    return (
      <Header>
        {this.props.logged ? (
          <div>
            <UserThumbnail thumbnail={this.props.thumbnail} onClick={this.handleThumbnailClick} />
          </div>
        ) : (
          <LoginButton />
        )}
        <UserMenuContainer />
      </Header>
    );
  }
}

// export default HeaderContainer;
export default compose(
  withRouter,
  connect(
    ({ base, user }: State) => ({
      visible: base.header.visible,
      logged: user.logged,
      username: user.loggedInfo.username,
      thumbnail: user.loggedInfo.thumbnail,
    }),
    dispatch => ({
      UserActions: bindActionCreators(userActions, dispatch),
      BaseActions: bindActionCreators(baseActions, dispatch),
    })
  )
)(HeaderContainer);
