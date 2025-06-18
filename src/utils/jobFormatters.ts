
// Utilities for formatting job data

// Format the date posted to be more user-friendly
export const formatDatePosted = (datePosted: string): string => {
  const date = new Date(datePosted);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
};

// Map remote status to job type
export const mapJobType = (remote: boolean): 'Full-time' | 'Part-time' | 'Contract' | 'Remote' => {
  if (remote) return 'Remote';
  return 'Full-time'; // Default to Full-time if not remote
};

// Format salary for display
export const formatSalary = (salary?: string): string => {
  if (!salary || salary.trim() === '') {
    return 'Salary not specified';
  }
  return salary;
};

// Extract skills from job description if not provided
export const extractSkills = (description: string): string[] => {
  const commonCyberSecuritySkills = [
    'Security', 'Cybersecurity', 'Network Security', 'Penetration Testing', 'SIEM',
    'Incident Response', 'Vulnerability Management', 'Security Architecture', 'Risk Assessment',
    'Compliance', 'Identity and Access Management', 'CISSP', 'CEH', 'Cloud Security',
    'Firewall', 'Encryption', 'Security Auditing', 'Ethical Hacking', 'OWASP'
  ];
  
  const skills: string[] = [];
  commonCyberSecuritySkills.forEach(skill => {
    if (description.toLowerCase().includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });
  
  return skills.length > 0 ? skills : ['Cybersecurity', 'Information Security'];
};
