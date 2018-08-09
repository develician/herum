import * as React from 'react';
import App from 'components/App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from 'store/configure';
import socket from 'lib/socket';

const store = configure();

const socketURI =
  process.env.NODE_ENV === 'production'
    ? (window.location.protocol === 'https' ? 'wss://' : 'ws://') + window.location.host + '/ws'
    : 'ws://localhost:4000/ws';

socket.initialize(store, socketURI);

// interface RootProps {
// }

const Root: React.SFC<{}> = props => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;
