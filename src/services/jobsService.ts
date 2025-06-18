
import { JobProps } from '@/types/jobTypes';
import { TheirStackResponse } from '@/types/jobTypes';
import { cacheData, getCachedData, CACHE_KEYS } from '@/utils/cacheUtils';
import { THEIR_STACK_API_URL, API_KEY, CACHE_TTL, USE_SAMPLE_DATA } from '@/config/apiConfig';
import { createSearchParams } from '@/utils/searchParamsBuilder';
import { mapTheirStackToJobProps } from '@/utils/jobMappers';

// Sample job data to use when API fails or for development
const getSampleJobs = (jobType?: string): JobProps[] => {
  const baseJobs = [
    {
      id: 'sample-1',
      title: jobType === 'security-architecture' ? 'Senior Security Architect' : 'Information Security Analyst',
      company: 'CyberGuard Solutions',
      location: 'London, UK (Remote)',
      description: 'Join our team to help protect critical infrastructure and sensitive data from cyber threats. You will be responsible for implementing security measures, monitoring for breaches, and responding to incidents.',
      salary: '£65,000 - £85,000 per annum',
      postedAt: '2 days ago',
      type: 'Remote' as const,
      logo: 'https://placehold.co/100x100?text=CG',
      skills: ['CISSP', 'Risk Assessment', 'Security Architecture', 'Cloud Security'],
      applyUrl: 'https://example.com/job1'
    },
    {
      id: 'sample-2',
      title: jobType === 'security-architecture' ? 'Cloud Security Architect' : 'Cybersecurity Specialist',
      company: 'SecureBank Financial',
      location: 'Manchester, UK',
      description: 'SecureBank is looking for a cybersecurity expert to join our growing team. You will help develop and implement security policies, conduct regular audits, and ensure compliance with industry standards.',
      salary: '£55,000 - £70,000 per annum',
      postedAt: '5 days ago',
      type: 'Full-time' as const,
      logo: 'https://placehold.co/100x100?text=SB',
      skills: ['Network Security', 'SIEM', 'Incident Response', 'Compliance'],
      applyUrl: 'https://example.com/job2'
    },
    {
      id: 'sample-3',
      title: jobType === 'security-architecture' ? 'Enterprise Security Architect' : 'Security Operations Analyst',
      company: 'TechDefend',
      location: 'Edinburgh, UK (Remote)',
      description: 'TechDefend is seeking a SOC analyst to monitor security events and respond to security incidents. You will be working with state-of-the-art tools to protect our clients from emerging threats.',
      salary: '£50,000 - £65,000 per annum',
      postedAt: '1 week ago',
      type: 'Remote' as const,
      logo: 'https://placehold.co/100x100?text=TD',
      skills: ['SOC', 'Threat Intelligence', 'SIEM', 'Incident Response'],
      applyUrl: 'https://example.com/job3'
    },
    {
      id: 'sample-4',
      title: jobType === 'security-architecture' ? 'Security Architecture Manager' : 'Penetration Tester',
      company: 'EthicalHack Ltd',
      location: 'Birmingham, UK',
      description: 'We are looking for an experienced penetration tester to join our red team. You will simulate cyber attacks to identify vulnerabilities in our clients\' systems before malicious actors can exploit them.',
      salary: '£60,000 - £80,000 per annum',
      postedAt: '3 days ago',
      type: 'Full-time' as const,
      logo: 'https://placehold.co/100x100?text=EH',
      skills: ['Penetration Testing', 'Ethical Hacking', 'OWASP', 'Vulnerability Management'],
      applyUrl: 'https://example.com/job4'
    },
    {
      id: 'sample-5',
      title: jobType === 'security-architecture' ? 'Lead Security Architecture Consultant' : 'Information Security Officer',
      company: 'DataSafe',
      location: 'Glasgow, UK',
      description: 'DataSafe is seeking an Information Security Officer to oversee our security program. You will be responsible for developing security strategies, managing risks, and ensuring compliance.',
      salary: '£70,000 - £90,000 per annum',
      postedAt: '1 week ago',
      type: 'Full-time' as const,
      logo: 'https://placehold.co/100x100?text=DS',
      skills: ['Risk Management', 'Compliance', 'Security Governance', 'Policy Development'],
      applyUrl: 'https://example.com/job5'
    },
    {
      id: 'sample-6',
      title: jobType === 'security-architecture' ? 'Security Architect - Cloud Infrastructure' : 'Cybersecurity Engineer',
      company: 'CloudGuard',
      location: 'Bristol, UK (Remote)',
      description: 'CloudGuard is looking for a cybersecurity engineer to help secure our cloud infrastructure. You will be working with cutting-edge technologies to protect against sophisticated threats.',
      salary: '£55,000 - £75,000 per annum',
      postedAt: '4 days ago',
      type: 'Remote' as const,
      logo: 'https://placehold.co/100x100?text=CG',
      skills: ['Cloud Security', 'AWS', 'Azure', 'DevSecOps'],
      applyUrl: 'https://example.com/job6'
    },
    {
      id: 'sample-7',
      title: jobType === 'security-architecture' ? 'Senior Security Solution Architect' : 'Identity and Access Management Specialist',
      company: 'SecureID',
      location: 'Leeds, UK',
      description: 'SecureID is seeking an IAM specialist to help implement and manage our identity and access management solutions. You will be working with a variety of technologies to secure user access.',
      salary: '£50,000 - £65,000 per annum',
      postedAt: '2 weeks ago',
      type: 'Full-time' as const,
      logo: 'https://placehold.co/100x100?text=SI',
      skills: ['IAM', 'OAuth', 'SAML', 'Active Directory'],
      applyUrl: 'https://example.com/job7'
    },
    {
      id: 'sample-8',
      title: jobType === 'security-architecture' ? 'Security Architecture Team Lead' : 'Security Compliance Analyst',
      company: 'RegTech Compliance',
      location: 'Cambridge, UK',
      description: 'RegTech Compliance is looking for a Security Compliance Analyst to ensure our clients meet regulatory requirements. You will be conducting audits and helping organizations improve their security posture.',
      salary: '£45,000 - £60,000 per annum',
      postedAt: '1 week ago',
      type: 'Full-time' as const,
      logo: 'https://placehold.co/100x100?text=RT',
      skills: ['Compliance', 'GDPR', 'ISO 27001', 'Risk Assessment'],
      applyUrl: 'https://example.com/job8'
    },
    {
      id: 'sample-9',
      title: jobType === 'security-architecture' ? 'AWS Security Architect' : 'Incident Response Specialist',
      company: 'Rapid Response',
      location: 'Cardiff, UK (Remote)',
      description: 'Rapid Response is seeking an Incident Response Specialist to help organizations recover from security breaches. You will be involved in investigating incidents and implementing recovery plans.',
      salary: '£55,000 - £70,000 per annum',
      postedAt: '3 days ago',
      type: 'Remote' as const,
      logo: 'https://placehold.co/100x100?text=RR',
      skills: ['Incident Response', 'Digital Forensics', 'Malware Analysis', 'Threat Hunting'],
      applyUrl: 'https://example.com/job9'
    },
    {
      id: 'sample-10',
      title: jobType === 'security-architecture' ? 'Security Infrastructure Architect' : 'Application Security Engineer',
      company: 'SecureCode',
      location: 'Oxford, UK',
      description: 'SecureCode is looking for an Application Security Engineer to help develop secure software. You will be working with development teams to implement security best practices throughout the SDLC.',
      salary: '£60,000 - £80,000 per annum',
      postedAt: '1 week ago',
      type: 'Full-time' as const,
      logo: 'https://placehold.co/100x100?text=SC',
      skills: ['SAST', 'DAST', 'Secure Coding', 'OWASP'],
      applyUrl: 'https://example.com/job10'
    }
  ];

  return baseJobs;
};

// Fetch cybersecurity jobs from TheirStack API with job type filter
export const fetchCyberSecurityJobs = async (jobType?: string): Promise<JobProps[]> => {
  try {
    console.log(`Fetching jobs with filter: ${jobType || 'none'}`);
    
    // Determine which cache key to use based on job type
    const cacheKey = jobType === 'security-architecture' 
      ? CACHE_KEYS.SECURITY_ARCHITECTURE_JOBS 
      : CACHE_KEYS.CYBERSECURITY_JOBS;
    
    // Check if we have cached data
    const cachedJobs = getCachedData<JobProps[]>(cacheKey);
    if (cachedJobs) {
      console.log(`Using ${cachedJobs.length} cached jobs`);
      return cachedJobs;
    }
    
    // If sample data flag is true, return sample data instead of calling API
    if (USE_SAMPLE_DATA) {
      console.log('Using sample data instead of API');
      const sampleJobs = getSampleJobs(jobType);
      cacheData(cacheKey, sampleJobs, CACHE_TTL);
      return sampleJobs;
    }
    
    console.log('No cache found or cache expired, fetching fresh data from API');
    const searchParams = createSearchParams(jobType);
    
    const response = await fetch(THEIR_STACK_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(searchParams)
    });
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      // If we get a 402 or other error, fall back to sample data
      console.log('API returned error, falling back to sample data');
      const fallbackJobs = getSampleJobs(jobType);
      cacheData(cacheKey, fallbackJobs, CACHE_TTL);
      return fallbackJobs;
    }
    
    const data: TheirStackResponse = await response.json();
    console.log('API response received:', data);
    
    // Check if we have job data
    if (!data || !data.data || data.data.length === 0) {
      console.log('No jobs returned from API, falling back to sample data');
      const fallbackJobs = getSampleJobs(jobType);
      cacheData(cacheKey, fallbackJobs, CACHE_TTL);
      return fallbackJobs;
    }
    
    // Map the TheirStack job data to our JobProps format
    const jobs = data.data.map(mapTheirStackToJobProps);
    
    // Cache the successful results
    console.log(`Caching ${jobs.length} jobs with key ${cacheKey}`);
    cacheData(cacheKey, jobs, CACHE_TTL);
    
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return sample data when API fails
    console.log('API call failed, returning sample data');
    const sampleJobs = getSampleJobs(jobType);
    return sampleJobs;
  }
};

// Specific function to fetch security architecture jobs
export const fetchSecurityArchitectureJobs = async (): Promise<JobProps[]> => {
  return fetchCyberSecurityJobs('security-architecture');
};

// Function to clear the jobs cache and force a refresh
export const refreshJobsCache = async (jobType?: string): Promise<JobProps[]> => {
  // Clear the specific cache
  const cacheKey = jobType === 'security-architecture' 
    ? CACHE_KEYS.SECURITY_ARCHITECTURE_JOBS 
    : CACHE_KEYS.CYBERSECURITY_JOBS;
  
  localStorage.removeItem(cacheKey);
  console.log(`Cache cleared for ${cacheKey}, fetching fresh data`);
  
  // Fetch fresh data
  return fetchCyberSecurityJobs(jobType);
};
