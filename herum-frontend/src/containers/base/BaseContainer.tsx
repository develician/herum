import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { userActions } from 'store/modules/user';
import { State } from 'store/modules';
import { withRouter } from 'react-router-dom';
import storage from 'lib/storage';

export interface BaseContainerProps {
  UserActions: typeof userActions;
}

class BaseContainer extends React.Component<BaseContainerProps> {
  public initializeUserInfo = async () => {
    const loggedInfo = storage.get('loggedInfo');
    if (!loggedInfo) {
      return;
    }

    const { UserActions } = this.props;

    UserActions.setLoggedInfo(loggedInfo);

    try {
      await UserActions.checkStatus();
    } catch (e) {
      storage.remove('loggedInfo');
      window.location.href = '/auth/login?expired';
    }
  };
  public componentDidMount() {
    this.initializeUserInfo();
  }
  public render() {
    return <div />;
  }
}

export default compose(
  withRouter,
  connect(
    ({  }: State) => ({}),
    dispatch => ({
      UserActions: bindActionCreators(userActions, dispatch),
    })
  )
)(BaseContainer);
