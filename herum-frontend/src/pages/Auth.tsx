import * as React from 'react';
import AuthContainer from 'containers/auth/AuthContainer';
import PageTemplate from 'components/base/PageTemplate';

interface AuthProps {
  match: any;
}

const Auth: React.SFC<AuthProps> = ({ match }) => {
  return (
    <PageTemplate>
      <AuthContainer />
    </PageTemplate>
  );
};

export default Auth;
