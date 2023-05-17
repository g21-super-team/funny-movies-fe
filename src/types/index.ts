export interface Post {
  _id: string;
  title: string;
  sharer: Sharer;
  url: string;
  description: string;
  like_count: number;
  unlike_count: number;
  thumbnail: string;
  create_at: Date;
  __v: number;
  reaction_state: string;
}

export interface Sharer {
  _id: string;
  email: string;
}
