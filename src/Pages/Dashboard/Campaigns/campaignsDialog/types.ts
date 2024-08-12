export interface Campaign {
  agency: boolean;
  blitz_autocampaign: boolean;
  brief: string;
  campaign_manager: CampaignManager;
  campaign_status: string;
  campaign_sum: number;
  campaign_type: string;
  campany_id: number;
  creators: Creator[];
  drive_link: string;
  finish_date: string;
  id: number;
  ideal_duedate: string;
  invoice_date: string;
  name: string;
  paid_date: string;
  po_number: string;
  proposal_date: string;
  shared_with: any;
  tools: Tool[];
  user_id: number;
  video_amount: number;
}

export interface CampaignManager {
  email: string;
  name: string;
  phone_number: string;
}

export interface Creator {
  code: string;
  creator_details: CreatorDetails;
  following: string;
  id: string;
  name: string;
  offerSent: boolean;
  pfphref?: string;
  platformLink: string;
  price: number;
  promotionPlatform: string;
  promotionType: string;
  status?: string;
  submissionLink?: string;
  assetsSent: boolean;
  liveLink?: string;
  postDate?: string;
  totalViews?: string;
  likes?: string;
  comments?: string;
  assetsApproved: boolean;
  skipPayout: boolean;
  creatorBrief: string;
  postingInstructions: string;
  boostCode: string;
}

export interface CreatorDetails {
  avg_turnaround_time_days: any;
  avg_views: any;
  blitz_score: any;
  creator: string;
  creator_type: string;
  date_added: string;
  dedicated: any;
  email: string;
  flag_notes: any;
  geolocation_gender_ethnicity: string;
  ig_feed_post?: string;
  ig_reels_brand?: string;
  ig_reels_sound?: string;
  ig_stories_bundle: any;
  ig_story: any;
  instagram?: string;
  instagram_link?: string;
  integration_3045s: any;
  integration_3m: any;
  integration_60s?: string;
  integration_90s: any;
  is_vendor: boolean;
  last_contact: any;
  last_inbound: any;
  last_rate_presented: string;
  last_rate_taken: any;
  last_updated: string;
  last_updated_insight: string;
  manager: string;
  mediakit: any;
  notes_content_style?: string;
  payout_email?: string;
  pfphref?: string;
  phone_number: string;
  primary_market: string;
  promos_completed: any;
  promos_pitched: number;
  promos_sent?: string;
  public: Public[];
  rate_2530s?: string;
  region: string;
  shorts?: string;
  snap: any;
  snap_link: any;
  snapchat_story_post: any;
  status: string;
  superviser?: string;
  tiktok?: string;
  tiktok_brand: string;
  tiktok_link?: string;
  tiktok_sound: string;
  total_inbound: any;
  total_paid_inbound: any;
  tweet: any;
  tweet_repost: any;
  twitch: any;
  twitch_link: any;
  twitter: any;
  twitter_link: any;
  youtube?: string;
  youtube_link?: string;
}

export interface Public {
  audience_data: AudienceDaum[];
  average_comments: number;
  average_likes: number;
  average_views: number;
  country_data: CountryDaum[];
  creator_id: string;
  failure_reason: any;
  platform: Platform;
  platform_id: number;
}

export interface AudienceDaum {
  age_range: string;
  gender: string;
  value: number;
}

export interface CountryDaum {
  code: string;
  value: number;
}

export interface Platform {
  id: number;
  insight_id: string;
  key: string;
  name: string;
}

export interface Tool {
  type: "bonus" | "productDelivery" | "hashtagPerformance";
  info: {
    creatorId: string;
    creatorName?: string;
    toolDescription?: string;
    bonusAmount?: string;
    deliveryAddress?: string;
    hashtagName?: string;
    hashtagDescription?: string;
    hashtagPerformance?: string;
  };
  meta?: {
    cameThrough?: boolean;
    deliveryMade?: boolean;
  };
}

export interface TimelineEvent {
  campaign_id: number;
  id: number;
  last_updated: string;
  last_user_updated: string | null;
  manager_completed: boolean;
  notes: string;
  objective: string;
  projected_date: string;
  status: string;
  username: string;
  will_delete: boolean;
}

export interface Timelines {
  campaign_name: string;
  events: TimelineEvent[];
}
