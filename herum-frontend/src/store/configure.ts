import { createStore, applyMiddleware } from 'redux';
import penderMiddleware from 'redux-pender';

import rootReducer from './modules';
const middlewares = [penderMiddleware()];

export default function configureStore() {
  // window 를 any 로 강제 캐스팅
  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  const store = createStore(rootReducer, devTools && devTools(), applyMiddleware(...middlewares));

  if ((module as any).hot) {
    (module as any).hot.accept('./modules', () => {
      const nextRootReducer = require('./modules').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
