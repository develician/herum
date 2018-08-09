import axios from 'axios';

type WritePayload = { content: string };
type CommentPayload = { postId: string; text: string };

export const write = (payload: WritePayload) => axios.post('/api/posts', payload);
// export const list = () => axios.get('/api/posts');
// export const listOfUser = (username: string) => axios.get(`/api/posts?username=${username}`);
export const list = (username?: string) =>
  axios.get('/api/posts' + (username ? `?username=${username}` : ''));
export const next = (url: string) => axios.get(url);
export const like = (postId: string) => axios.post(`/api/posts/${postId}/likes`);
export const unlike = (postId: string) => axios.delete(`/api/posts/${postId}/likes`);
export const comment = (payload: CommentPayload) =>
  axios.post(`/api/posts/${payload.postId}/comments`, { text: payload.text });
