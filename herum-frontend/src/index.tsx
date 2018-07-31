import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './Root';
import { AppContainer } from 'react-hot-loader';
import 'styles/base.scss';
import registerServiceWorker from './registerServiceWorker';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root') as HTMLElement
  );
};

render(Root);

if ((module as any).hot) {
  (module as any).hot.accept('./Root', () => render(Root));
}

registerServiceWorker();
