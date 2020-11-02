export interface Post{
  id: string
  title: string
  body: string
}
export interface PostsData{
  posts: {
    __typename: string
    data: Post[]
  }
}

export interface PostsVars {
  page: number;
  limit: number;
}