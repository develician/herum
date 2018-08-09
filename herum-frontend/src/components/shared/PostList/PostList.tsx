import * as React from 'react';
import styles from './PostList.scss';
import * as classNames from 'classnames/bind';
import Masonry from 'react-masonry-component';
import Post from '../Post/Post';
import { Post as PostType } from 'store/modules/posts';

const cx = classNames.bind(styles);

interface PostListProps {
  posts: PostType[];
  masonryRef: any;
  onToggleLike({ postId, liked }): any;
  onCommentClick(postId: string): void;
  onRelayout?(): void;
}

const PostList: React.SFC<PostListProps> = ({
  posts,
  onToggleLike,
  onCommentClick,
  masonryRef,
  onRelayout,
}) => {
  const postList = posts.map(post => {
    return (
      <Post
        key={post._id}
        post={post}
        onToggleLike={onToggleLike}
        onCommentClick={onCommentClick}
        onRelayout={onRelayout}
      />
    );
  });
  return (
    <div className={cx('Wrapper')}>
      <Masonry options={{ gutter: 16 }} ref={masonryRef}>
        {postList}
      </Masonry>
    </div>
  );
};

export default PostList;
