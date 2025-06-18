
import { TheirStackJob } from '@/types/jobTypes';
import { JobProps } from '@/types/jobTypes';
import { 
  formatDatePosted, 
  mapJobType, 
  formatSalary, 
  extractSkills 
} from './jobFormatters';

// Map TheirStack API job to our JobProps format
export const mapTheirStackToJobProps = (job: TheirStackJob): JobProps => {
  // Extract skills from description
  const jobSkills = extractSkills(job.description);
  
  // Get logo URL or use placeholder
  const logoUrl = job.company_object?.logo || 'https://placehold.co/100x100?text=Company';
  
  // Format location
  const location = job.long_location || job.short_location || job.location || 'Remote';
  
  return {
    id: job.id,
    title: job.job_title,
    company: job.company || job.company_object?.name || 'Unknown Company',
    location: job.remote ? `${location} (Remote)` : location,
    description: job.description,
    salary: formatSalary(job.salary_string),
    postedAt: formatDatePosted(job.date_posted),
    type: mapJobType(job.remote),
    logo: logoUrl,
    skills: jobSkills,
    applyUrl: job.url || ''
  };
};
