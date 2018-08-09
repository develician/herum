import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { baseActions } from 'store/modules/base';
import { userActions } from 'store/modules/user';
import { State } from 'store/modules';
import { withRouter } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';
import storage from 'lib/storage';
import UserMenu from 'components/base/UserMenu';
import Username from 'components/base/Username';
import UserMenuItem from 'components/base/UserMenuItem';

export interface UserMenuContainerProps {
  BaseActions: typeof baseActions;
  UserActions: typeof userActions;
  username: string;
  visible: boolean;
  history: any;
}

class UserMenuContainer extends React.Component<UserMenuContainerProps> {
  public handleClickOutside = () => {
    const { BaseActions } = this.props;
    BaseActions.setUserMenuVisibility(false);
  };

  public handleLogout = async () => {
    const { UserActions } = this.props;

    try {
      await UserActions.logout();
    } catch (e) {
      console.log(e);
    }

    storage.remove('loggedInfo');
    window.location.href = '/';
  };

  public handleOpenMyHerum = () => {
    const { username, BaseActions } = this.props;
    this.props.history.push(`/@${username}`);
    BaseActions.setUserMenuVisibility(false);
  };

  public render() {
    const { visible, username } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <UserMenu>
        <Username username={username} />
        <UserMenuItem onClick={this.handleOpenMyHerum}>나의 흐름</UserMenuItem>
        <UserMenuItem>설정</UserMenuItem>
        <UserMenuItem onClick={this.handleLogout}>로그아웃</UserMenuItem>
      </UserMenu>
    );
  }
}

export default compose(
  withRouter,
  connect(
    ({ user, base }: State) => ({
      username: user.loggedInfo.username,
      visible: base.userMenu.visible,
    }),
    dispatch => ({
      BaseActions: bindActionCreators(baseActions, dispatch),
      UserActions: bindActionCreators(userActions, dispatch),
    })
  )
)(onClickOutside(UserMenuContainer));
