export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    nickname: string;
  };
  comments?: {
    id: string;
  }[];
}
