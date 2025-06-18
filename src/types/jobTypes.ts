
// Job-related type definitions

export interface JobProps {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  salary: string;
  date_posted_label: string;
  employment_type: string;
 // employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  logo: string;
  technologies: string[];
  url?: string;
  companyDetails?: CompanyObject;
}

// Company object interface
export interface CompanyObject {
  company_name: string;
  domain?: string;
  industry?: string;
  country?: string;
  country_code?: string;
  employee_count?: number;
  logo?: string;
  num_jobs?: number;
  num_technologies?: number;
  possible_domains?: string[];
  website?: string;
  industry_id?: number;
  linkedin_url?: string;
  total_jobs_last_30_days?: number;
  total_jobs_found?: number | null;
  yc_batch?: string | null;
  apollo_id?: string;
  linkedin_id?: string;
  url_source?: string | null;
  is_recruiting_agency?: boolean;
  id?: string;
  founded_year?: number;
  annual_revenue_usd?: number;
  annual_revenue?: string;
  total_funding_usd?: number;
  last_funding_round_date?: string;
  last_funding_round_amount_readable?: string;
  employee_count_range?: string;
  long_description?: string;
  seo_description?: string;
  city?: string;
}

// TheirStack API related interfaces
export interface TheirStackJob {
  id: string;
  job_title: string;
  description: string;
  company: string;
  company_object?: {
    logo?: string;
    name?: string;
  };
  location: string;
  short_location?: string;
  long_location?: string;
  salary_string?: string;
  date_posted: string;
  url?: string;
  remote: boolean;
}

export interface TheirStackResponse {
  data: TheirStackJob[];
  metadata?: {
    total_results?: number;
  };
}

// TheirStack API search parameters
export interface SearchParams {
  page: number;
  limit: number;
  order_by: Array<{
    desc: boolean;
    field: string;
  }>;
  include_total_results: boolean;
  blur_company_data: boolean;
  job_title_or?: string[];
  job_country_code_or: string[];
  posted_at_max_age_days: number;
}
