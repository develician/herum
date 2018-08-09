import * as React from 'react';
import PageWrapper from 'components/base/PageWrapper';
import PageTemplate from 'components/base/PageTemplate';
import UserHeadContainer from 'containers/user/UserHeadContainer';
import PostListContainer from 'containers/shared/PostListContainer';
import socket from 'lib/socket';

export interface UserProps {
  match: any;
}

export default class User extends React.Component<UserProps, any> {
  public componentDidMount() {
    socket.ignore();
  }
  public componentWillMount() {
    socket.listen();
  }
  public render() {
    const { username } = this.props.match.params;
    return (
      <PageTemplate>
        <PageWrapper>
          <UserHeadContainer username={username} />
          <PostListContainer username={username} />
        </PageWrapper>
      </PageTemplate>
    );
  }
}
