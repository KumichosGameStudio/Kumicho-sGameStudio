export type UserRole = 'novelist' | 'narrator';

export type Genre =
  | 'fantasy'
  | 'mystery'
  | 'romance'
  | 'sci-fi'
  | 'horror'
  | 'essay'
  | 'other';

export interface Profile {
  id: string;
  role: UserRole | null;
  handle: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string> | null;
}

export interface Novel {
  id: string;
  author_id: string;
  title: string;
  body_text: string;
  summary: string;
  genre: Genre;
  created_at: string;
  author?: Pick<Profile, 'id' | 'handle' | 'display_name' | 'avatar_url'>;
}

export interface Audio {
  id: string;
  novel_id: string;
  narrator_id: string;
  title: string;
  description: string;
  audio_url: string;
  transcript_text: string;
  genre: Genre;
  created_at: string;
  narrator?: Pick<Profile, 'id' | 'handle' | 'display_name' | 'avatar_url'>;
  novel?: Pick<Novel, 'id' | 'title'>;
}

export interface DailyPick {
  pick_date: string;
  novel_ids: string[];
}
