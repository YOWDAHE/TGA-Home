// Landing page data types based on API response

export interface LandingData {
  id: number;
  logo_url: string;
  hero_image_url: string;
  hero_title: string;
  about_us: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stat {
  id: number;
  stat: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: number;
  name: string;
  logo_url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Practice {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactUs {
  id: number;
  medium: string;
  email: string | null;
  phone_number: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsLink {
  id: number;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPageResponse {
  message: string;
  status: string;
  error: string | null;
  data: {
    landing: LandingData;
    stats: Stat[];
    partners: Partner[];
    practices: Practice[];
    contactUs: ContactUs[];
    newsLinks: NewsLink[];
    homeContent: HomeContent;
  };
}

// Written home page sections, edited in the admin. Long text is HTML from its rich-text editor.
export interface HomeContent {
  hero: {
    label: string;
    slides: Array<{ title: string; text: string }>;
    highlight: { value: string; word: string; caption: string };
  };
  statement: { html: string };
  about: {
    label: string;
    title: string;
    description: string;
    lists: Array<{ title: string; html: string }>;
    milestones: { label: string; slides: Array<{ html: string; images: string[] }> };
    partner: { label: string; name: string; photo: string; bio: string };
  };
  services: {
    label: string;
    title: string;
    description: string;
    items: Array<{ title: string; html: string }>;
  };
} 