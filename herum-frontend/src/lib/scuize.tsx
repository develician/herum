import * as React from 'react';

export default (FunctionalComponent, shouldComponentUpdate) =>
  class extends React.Component {
    public shouldComponentUpdate(nextProps, nextState) {
      return shouldComponentUpdate.bind(this)(nextProps, nextState);
    }

    public render() {
      return <FunctionalComponent {...this.props} />;
    }
  };

// usage
/*
    export default scuize(EpisodeList, function(nextProps, nextState) {
        return true;
    });
*/
