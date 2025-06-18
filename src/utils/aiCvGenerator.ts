
import { toast } from "@/components/ui/use-toast";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
}

export interface AiGeneratedContent {
  enhancedSummary: string;
  enhancedExperiences: {
    id: string;
    enhancedDescription: string;
  }[];
  suggestedSkills: string[];
}

// Mock AI generation for now, this would be replaced with actual AI API integration
export const generateCvContent = async (
  experiences: Experience[],
  skills: Skill[],
  currentSummary: string,
  jobDescription?: string
): Promise<AiGeneratedContent> => {
  // In a real implementation, this would call an API like OpenAI
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const skillNames = skills.map(skill => skill.name);
    
    // Generate enhanced summary based on skills and experience
    const enhancedSummary = generateEnhancedSummary(experiences, skillNames, currentSummary, jobDescription);
    
    // Generate enhanced descriptions for each experience
    const enhancedExperiences = experiences.map(exp => ({
      id: exp.id,
      enhancedDescription: generateEnhancedExperienceDescription(exp, skillNames, jobDescription)
    }));
    
    // Generate additional suggested skills based on experiences and job description
    const suggestedSkills = generateSuggestedSkills(experiences, skillNames, jobDescription);
    
    return {
      enhancedSummary,
      enhancedExperiences,
      suggestedSkills
    };
  } catch (error) {
    console.error("Error generating CV content:", error);
    toast({
      title: "Generation Failed",
      description: "Failed to generate enhanced CV content. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Cybersecurity keywords for enhancing content
const cyberSecurityKeywords = [
  "Threat Intelligence", "Vulnerability Management", "Penetration Testing", 
  "Security Operations Center (SOC)", "SIEM", "Incident Response",
  "Zero Trust Architecture", "Cloud Security", "DevSecOps",
  "Security Compliance", "Risk Assessment", "Network Security",
  "Endpoint Protection", "Data Loss Prevention (DLP)", "IAM",
  "Security Frameworks", "Encryption", "Threat Hunting",
  "Cyber Threat Analysis", "Security Auditing", "OWASP",
  "Red Team", "Blue Team", "Purple Team", "Ethical Hacking",
  "MITRE ATT&CK", "NIST Framework", "ISO 27001", "GDPR Compliance",
  "SOC 2", "PCI DSS", "Secure SDLC", "API Security",
  "Container Security", "Kubernetes Security", "CSPM", "CWPP", 
  "Security Architecture", "Firewall Management", "IDS/IPS",
  "Threat Modeling", "Digital Forensics", "Malware Analysis",
  "Secure Code Review", "Security Automation", "CASB",
  "Zero-Day Vulnerabilities", "CISM", "CISSP", "CEH", "OSCP"
];

// Extract relevant keywords from job description
const extractJobKeywords = (jobDescription: string): string[] => {
  if (!jobDescription) return [];
  
  const relevantKeywords: string[] = [];
  
  // Check which cybersecurity keywords appear in the job description
  cyberSecurityKeywords.forEach(keyword => {
    if (jobDescription.toLowerCase().includes(keyword.toLowerCase())) {
      relevantKeywords.push(keyword);
    }
  });
  
  // Take top 5-10 most relevant keywords or all if less than 5
  return relevantKeywords.slice(0, 10);
};

// Mock function to generate an enhanced summary
const generateEnhancedSummary = (
  experiences: Experience[], 
  skills: string[],
  currentSummary: string,
  jobDescription?: string
): string => {
  if (currentSummary && currentSummary.length > 100 && !jobDescription) {
    return currentSummary;
  }
  
  const mostRecentJob = experiences[0]?.title || "cybersecurity professional";
  const yearsOfExperience = experiences.length > 0 ? experiences.length + 3 : 5;
  
  // Determine which skills to highlight based on job description or use top skills
  let highlightedSkills: string[] = [];
  let focusAreas: string[] = [];
  
  if (jobDescription) {
    // Extract keywords from job description to tailor the summary
    const jobKeywords = extractJobKeywords(jobDescription);
    
    // Find matching skills from user's skill set
    highlightedSkills = skills.filter(skill => 
      jobKeywords.some(keyword => 
        skill.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    // If not enough matching skills, add some from the user's top skills
    if (highlightedSkills.length < 3) {
      const additionalSkills = skills
        .filter(skill => !highlightedSkills.includes(skill))
        .slice(0, 3 - highlightedSkills.length);
      
      highlightedSkills = [...highlightedSkills, ...additionalSkills];
    }
    
    // Add focus areas from job keywords that aren't already covered by skills
    focusAreas = jobKeywords
      .filter(keyword => 
        !highlightedSkills.some(skill => 
          skill.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(skill.toLowerCase())
        )
      )
      .slice(0, 2);
  } else {
    // Default to top user skills if no job description
    highlightedSkills = skills.slice(0, 3);
  }
  
  // Ensure we have at least some skills to highlight
  if (highlightedSkills.length === 0) {
    highlightedSkills = ["network security", "threat detection", "vulnerability assessment"];
  }
  
  const skillsString = highlightedSkills.join(", ");
  const focusString = focusAreas.length > 0 ? 
    ` with additional focus on ${focusAreas.join(" and ")}` : 
    "";
  
  return `Dedicated ${mostRecentJob} with ${yearsOfExperience}+ years of experience in cybersecurity operations and risk management. Proven expertise in ${skillsString}${focusString}. Demonstrated track record of implementing robust security protocols, defending against sophisticated cyber threats, and aligning security strategies with organizational goals. Skilled communicator able to translate complex security concepts for both technical and non-technical stakeholders while maintaining vigilance against emerging vulnerabilities through continuous learning and professional development.`;
};

// Mock function to enhance experience descriptions
const generateEnhancedExperienceDescription = (
  experience: Experience,
  skills: string[],
  jobDescription?: string
): string => {
  if (experience.description && experience.description.length > 100 && !jobDescription) {
    return experience.description;
  }
  
  // Determine which skills to highlight based on job description or use relevant skills
  let relevantSkills: string[];
  
  if (jobDescription) {
    // Extract keywords from job description
    const jobKeywords = extractJobKeywords(jobDescription);
    
    // Find matching skills from user's skill set
    relevantSkills = skills.filter(skill => 
      jobKeywords.some(keyword => 
        skill.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    // If not enough matching skills, add some from the user's skills
    if (relevantSkills.length < 3) {
      const additionalSkills = skills
        .filter(skill => !relevantSkills.includes(skill))
        .slice(0, 3 - relevantSkills.length);
      
      relevantSkills = [...relevantSkills, ...additionalSkills];
    }
  } else {
    // Default to relevant skills if no job description
    relevantSkills = skills.slice(0, 3);
  }
  
  // Ensure we have at least some skills to highlight
  if (relevantSkills.length === 0) {
    relevantSkills = ["security monitoring", "incident response", "vulnerability assessment"];
  }
  
  const skillsString = relevantSkills.join(", ");
  
  const descriptions = [
    `Led implementation of advanced ${skillsString} solutions, reducing security incidents by 45% and enhancing overall security posture. Collaborated with cross-functional teams to integrate security best practices into development lifecycle, ensuring compliance with industry standards and regulatory requirements. Conducted regular threat intelligence briefings to inform strategic security decisions and facilitate proactive defense measures.`,
    
    `Designed and deployed comprehensive security architecture utilizing ${skillsString}. Conducted regular vulnerability assessments and penetration testing, identifying and remediating critical security gaps before exploitation. Developed and maintained security policies aligned with NIST framework while implementing automated security controls to reduce manual effort by 60% and improve detection accuracy.`,
    
    `Spearheaded security operations team response to incidents leveraging expertise in ${skillsString}. Implemented automated security monitoring systems, reducing mean time to detect threats by 60%. Presented monthly security metrics to executive leadership, highlighting proactive security measures and risk reduction strategies that resulted in 35% improvement in overall security posture.`
  ];
  
  // Use the job title to help determine which description to use
  const titleLower = experience.title.toLowerCase();
  if (titleLower.includes("analyst") || titleLower.includes("specialist")) {
    return descriptions[0];
  } else if (titleLower.includes("architect") || titleLower.includes("engineer")) {
    return descriptions[1];
  } else {
    return descriptions[2];
  }
};

// Mock function to suggest additional relevant skills
const generateSuggestedSkills = (
  experiences: Experience[],
  existingSkills: string[],
  jobDescription?: string
): string[] => {
  // Core cybersecurity skills that are commonly required
  const commonCyberSkills = [
    "SIEM", "Threat Hunting", "Incident Response", "Malware Analysis",
    "Penetration Testing", "Vulnerability Assessment", "Network Security",
    "Security Architecture", "Cloud Security", "DevSecOps",
    "Risk Assessment", "Compliance", "OWASP", "Firewall Configuration",
    "Intrusion Detection", "Encryption", "Identity Management", "Forensics",
    "NIST Framework", "Zero Trust", "Security Automation", "Threat Modeling",
    "MITRE ATT&CK", "Secure SDLC", "Container Security", "API Security"
  ];
  
  let suggestedSkills: string[] = [];
  
  // If job description is provided, extract relevant skills from it
  if (jobDescription) {
    const jobKeywords = extractJobKeywords(jobDescription);
    
    // Suggest skills from job description that aren't in user's existing skills
    suggestedSkills = jobKeywords.filter(
      keyword => !existingSkills.some(
        existingSkill => 
          existingSkill.toLowerCase() === keyword.toLowerCase() ||
          existingSkill.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(existingSkill.toLowerCase())
      )
    );
    
    // If we don't have enough suggestions from job description, add from common skills
    if (suggestedSkills.length < 5) {
      const additionalSuggestions = commonCyberSkills.filter(
        skill => !existingSkills.some(
          existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
        ) && !suggestedSkills.some(
          suggestedSkill => suggestedSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      suggestedSkills = [...suggestedSkills, ...additionalSuggestions].slice(0, 5);
    }
  } else {
    // Filter out skills that the user already has
    suggestedSkills = commonCyberSkills.filter(
      skill => !existingSkills.some(
        existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
      )
    );
    
    // Return 5 random skills from the filtered list
    suggestedSkills = suggestedSkills
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }
  
  return suggestedSkills;
};
