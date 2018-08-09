import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, User } from 'pages';
import AuthContainer from 'containers/auth/AuthContainer';
import BaseContainer from 'containers/base/BaseContainer';

// interface AppProps {
// }

const App: React.SFC<{}> = props => {
  return (
    <div>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route path="/auth/:category" component={AuthContainer} />
        <Route path="/@:username" component={User} />
      </Switch>
      <BaseContainer />
    </div>
  );
};

export default App;
