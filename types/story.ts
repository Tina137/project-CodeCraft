export interface StoryOwner {
  _id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  ownerId: StoryOwner;
  date: string;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedStoriesResponse = {
  data: Story[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export interface StoryInitialData {
  _id?: string;
  img: string;
  title: string;
  article: string;
  category: string | { _id: string; name: string };
}

export interface StoryFormValues {
  img: File | null;
  title: string;
  article: string;
  category: string;
}
