import axios from "../lib/axios";
import { Post } from "../types";

export const getMe = () => axios.get("/users/me");
export const rfToken = () => axios.get("/auth/refresh-token");
export const getPosts = ({
  limit,
  skip,
}: any): Promise<{ result: Post[]; count: number }> =>
  axios.get(`/movies?limit=${limit}&skip=${skip}`);

export const login = (params: { email: string; password: string }) =>
  axios.post("/auth/login", {
    email: params.email,
    password: params.password,
  });

export const register = (email?: string, password?: string) =>
  axios.post("/auth/register", {
    email: email,
    password: password,
  });

export const shareMovies = (url: string) =>
  axios.post("/movies", {
    url: url,
  });

export const like = (id?: string): Promise<any> =>
  axios.post("/movies/like", {
    postId: id,
  });

export const unlike = (id?: string): Promise<any> =>
  axios.post("/movies/unlike", {
    postId: id,
  });

export const logout = () => axios.get("/auth/logout");
