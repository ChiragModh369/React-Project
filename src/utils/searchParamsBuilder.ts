
import { SearchParams } from '@/types/jobTypes';

// Create search parameters for the TheirStack API based on job type
export const createSearchParams = (jobType?: string): SearchParams => {
  // Base search parameters matching the provided curl command
  const baseParams = {
    page: 0,
    limit: 10,
    order_by: [
      {
        desc: true,
        field: "date_posted"
      }
    ],
    include_total_results: false,
    blur_company_data: false,
    job_country_code_or: ["GB"],
    posted_at_max_age_days: 15
  };
  
  // Adjust job titles based on job type
  if (jobType === 'security-architecture') {
    return {
      ...baseParams,
      job_title_or: ["Security Architect", "Security Architecture"]
    };
  }
  
  // Default to Information security
  return {
    ...baseParams,
    job_title_or: ["Information security"]
  };
};
