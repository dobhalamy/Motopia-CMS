import api from './api';
import unify from './api/unify';

export const getAll = () => unify(api.get('/blog-posts'));
export const addBlogPost = data => unify(api.post('/blog-posts', data));
export const updateBlogPost = data => unify(api.put(`/blog-posts/${data._id}`, data));
export const deleteBlogPost = id => unify(api.delete(`/blog-posts/${id}`));
