export interface RecommendationCategory {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  name: string;
  category_id: string;
  description: string;
  image_url: string | null;
  cta_text: string;
  affiliate_link: string;
  tags: string[];
  is_active: boolean;
  click_count: number;
  created_at: string;
  category?: RecommendationCategory;
}

export interface RecommendationClick {
  id: string;
  recommendation_id: string;
  user_id: string | null;
  clicked_at: string;
}
