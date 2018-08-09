import * as React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import PageWrapper from 'components/base/PageWrapper';
import WritePostContainer from 'containers/home/WritePostContainer';
import PostListContainer from 'containers/shared/PostListContainer';

// interface HomeProps {
// }

const Home: React.SFC<{}> = props => {
  return (
    <PageTemplate>
      <PageWrapper>
        <WritePostContainer />
        <PostListContainer />
      </PageWrapper>
    </PageTemplate>
  );
};

export default Home;
