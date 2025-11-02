export interface ClubMember {
  id: string;
  supplier_id: string;
  benefit: string;
  coupon_code: string;
  expiry_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  supplier?: {
    id: string;
    name: string;
    instagram: string;
    categories: string[];
  };
}
