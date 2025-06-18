
import { toast } from "@/components/ui/use-toast";

interface GenerateResponsibilitiesProps {
  jobTitle: string;
  jobDescription: string;
  skills: string[];
  experienceLevel?: string;
}

/**
 * Generate job responsibilities using AI based on a job description and user skills
 */
export const generateResponsibilities = async (
  props: GenerateResponsibilitiesProps
): Promise<string[]> => {
  const { jobTitle, jobDescription, skills, experienceLevel = "mid" } = props;
  
  try {
    // This would be where you'd make an API call to an LLM service
    // For now, we'll create an enhanced mock implementation
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Extract key information from job description
    const keyTerms = extractKeyTerms(jobDescription);
    const relevantSkills = findRelevantSkills(skills, jobDescription);
    
    // Generate responsibilities based on job information
    return generateAIResponsibilities(
      jobTitle, 
      keyTerms, 
      relevantSkills, 
      experienceLevel
    );
  } catch (error) {
    console.error("Error generating responsibilities:", error);
    toast({
      title: "Generation Failed",
      description: "Failed to generate AI responsibilities. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Extract key terms and requirements from job description
 */
const extractKeyTerms = (jobDescription: string): string[] => {
  // In a real implementation, this would use NLP techniques or call an AI API
  // For our enhanced mock, we'll use a more sophisticated approach
  
  const securityTerms = [
    "vulnerability", "threat", "risk", "compliance", "audit", 
    "incident response", "penetration", "monitoring", "secure", "attack",
    "defense", "protection", "remediation", "detection", "assessment",
    "SIEM", "firewall", "encryption", "authentication", "authorization",
    "access control", "security architecture", "governance"
  ];
  
  const cloudTerms = [
    "AWS", "Azure", "GCP", "cloud security", "cloud architecture",
    "infrastructure as code", "containerization", "Kubernetes", "Docker",
    "serverless", "microservices", "CI/CD", "DevSecOps"
  ];
  
  const regulatoryTerms = [
    "ISO 27001", "NIST", "GDPR", "HIPAA", "SOC 2", "PCI DSS",
    "regulatory compliance", "framework", "policy", "procedure",
    "standard", "control", "documentation", "evidence"
  ];
  
  const allTerms = [...securityTerms, ...cloudTerms, ...regulatoryTerms];
  
  // Find terms that appear in the job description
  const foundTerms = allTerms.filter(term => 
    jobDescription.toLowerCase().includes(term.toLowerCase())
  );
  
  // Get some specific terms that appear most frequently
  const descriptionLower = jobDescription.toLowerCase();
  const termFrequency = foundTerms.map(term => ({
    term,
    count: (descriptionLower.match(new RegExp(term.toLowerCase(), "g")) || []).length
  })).sort((a, b) => b.count - a.count);
  
  // Take the top terms plus some random ones for variety
  const priorityTerms = termFrequency.slice(0, 6).map(t => t.term);
  const randomTerms = foundTerms
    .filter(term => !priorityTerms.includes(term))
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
  return [...new Set([...priorityTerms, ...randomTerms])];
};

/**
 * Find skills from user's skill set that match the job description
 */
const findRelevantSkills = (skills: string[], jobDescription: string): string[] => {
  // Find skills that appear in the job description
  const relevantSkills = skills.filter(skill => 
    jobDescription.toLowerCase().includes(skill.toLowerCase())
  );
  
  // If not enough matches, add skills based on cybersecurity domains
  if (relevantSkills.length < 3) {
    const descriptionLower = jobDescription.toLowerCase();
    
    const securityDomains = [
      { domain: "network security", keywords: ["network", "firewall", "router", "switch", "vpc"] },
      { domain: "cloud security", keywords: ["aws", "azure", "gcp", "cloud"] },
      { domain: "application security", keywords: ["application", "code", "secure coding", "owasp"] },
      { domain: "security operations", keywords: ["soc", "monitoring", "alert", "incident"] },
      { domain: "governance", keywords: ["compliance", "policy", "procedure", "audit"] }
    ];
    
    // Find domains mentioned in the job description
    const matchingDomains = securityDomains.filter(domain => 
      domain.keywords.some(keyword => descriptionLower.includes(keyword))
    );
    
    // For each matching domain, try to find a matching skill
    const domainSkills = matchingDomains.map(domain => {
      // Find a skill that relates to this domain
      const matchingSkill = skills.find(skill => 
        skill.toLowerCase().includes(domain.domain) || 
        domain.keywords.some(keyword => skill.toLowerCase().includes(keyword))
      );
      
      return matchingSkill || domain.domain;
    });
    
    // Combine with directly relevant skills
    relevantSkills.push(...domainSkills);
  }
  
  // Return unique skills
  return [...new Set(relevantSkills)].slice(0, 5);
};

/**
 * Generate AI-like responsibilities based on job title and terms
 */
const generateAIResponsibilities = (
  jobTitle: string, 
  keyTerms: string[], 
  relevantSkills: string[],
  experienceLevel: string
): string[] => {
  const titleLower = jobTitle.toLowerCase();
  const responsibilities: string[] = [];
  const verbs = getVerbsByExperienceLevel(experienceLevel);
  
  // Generate title-specific responsibilities
  if (titleLower.includes("architect")) {
    responsibilities.push(
      `${sample(verbs.leadership)} and implemented comprehensive security architecture frameworks aligned with industry standards, incorporating ${sample(relevantSkills)} to secure enterprise systems`,
      `${sample(verbs.planning)} security reference architectures for ${keyTerms.includes("cloud") ? "cloud-based" : "enterprise"} systems ensuring compliance with ${keyTerms.find(t => t.includes("ISO") || t.includes("NIST") || t.includes("compliance")) || "regulatory requirements"}`,
      `${sample(verbs.leadership)} cross-functional security architecture reviews, assessing impacts and mitigating risks for ${keyTerms.includes("cloud") ? "cloud migrations" : "technology initiatives"}`
    );
  } else if (titleLower.includes("analyst")) {
    responsibilities.push(
      `${sample(verbs.execution)} security events using ${keyTerms.includes("SIEM") ? "SIEM tools" : "security monitoring platforms"} to identify and respond to ${sample(keyTerms.filter(t => t.includes("threat") || t.includes("attack") || t.includes("vulner")))} in real-time`,
      `${sample(verbs.execution)} security incident investigations and ${sample(verbs.execution)} remediation strategies, reducing mean time to respond by 40%`,
      `${sample(verbs.execution)} ${keyTerms.find(t => t.includes("vulnerability") || t.includes("assessment")) || "vulnerability assessments"} and prioritized security improvements based on risk metrics`
    );
  } else if (titleLower.includes("engineer")) {
    responsibilities.push(
      `${sample(verbs.execution)} and maintained security controls across ${keyTerms.includes("cloud") ? "cloud infrastructure" : "network infrastructure"} utilizing ${sample(relevantSkills)}`,
      `${sample(verbs.development)} automation ${keyTerms.includes("DevSecOps") ? "pipelines" : "scripts"} to enhance security ${keyTerms.includes("monitoring") ? "monitoring" : "operations"} and response capabilities, reducing manual effort by 65%`,
      `${sample(verbs.collaboration)} with development teams to integrate security into ${keyTerms.includes("CI/CD") ? "CI/CD pipelines" : "software development lifecycle"}`
    );
  } else if (titleLower.includes("consultant") || titleLower.includes("advisor")) {
    responsibilities.push(
      `${sample(verbs.leadership)} security strategy sessions with executive stakeholders, delivering expert guidance on ${sample(relevantSkills)} and ${sample(keyTerms)}`,
      `${sample(verbs.execution)} comprehensive security assessments and delivered detailed reports with actionable recommendations for ${keyTerms.includes("compliance") ? "compliance improvements" : "security enhancements"}`,
      `${sample(verbs.development)} security strategies and roadmaps aligned with business objectives, focusing on ${sample(keyTerms)} and ${sample(relevantSkills)}`
    );
  } else {
    responsibilities.push(
      `${sample(verbs.execution)} cybersecurity best practices to protect organizational data and systems, with emphasis on ${sample(relevantSkills)}`,
      `${sample(verbs.development)} ${keyTerms.find(t => t.includes("policy") || t.includes("procedure")) || "security protocols"} to enhance organizational security posture and reduce risk exposure`,
      `${sample(verbs.execution)} ${keyTerms.find(t => t.includes("incident") || t.includes("response")) || "security incidents"} and implemented remediation measures to minimize impact`
    );
  }
  
  // Add responsibilities based on key terms
  keyTerms.forEach((term, index) => {
    if (index < 3 && !responsibilities.some(r => r.toLowerCase().includes(term.toLowerCase()))) {
      if (term.includes("vulnerability") || term.includes("assessment")) {
        responsibilities.push(`${sample(verbs.execution)} vulnerability management program resulting in 60% reduction in critical vulnerabilities through systematic scanning and ${sample(verbs.execution)}`);
      } else if (term.includes("incident") || term.includes("response")) {
        responsibilities.push(`${sample(verbs.development)} incident response procedures and ${sample(verbs.leadership)} investigations for security breaches, reducing mean time to respond by 40%`);
      } else if (term.includes("compliance") || term.includes("regulatory")) {
        const frameworks = ["GDPR", "HIPAA", "PCI DSS", "SOC 2", "NIST CSF"];
        const mentionedFrameworks = frameworks.filter(f => keyTerms.some(t => t.includes(f)));
        const frameworkString = mentionedFrameworks.length > 0 
          ? mentionedFrameworks.join(", ") 
          : "regulatory frameworks";
        
        responsibilities.push(`${sample(verbs.management)} compliance with ${frameworkString} through implementation of controls, documentation, and ${sample(verbs.leadership)} internal audits`);
      } else if (term.includes("cloud") || term.includes("AWS") || term.includes("Azure")) {
        responsibilities.push(`${sample(verbs.execution)} cloud security governance and ${sample(verbs.development)} secure architectures for ${term.includes("AWS") ? "AWS" : term.includes("Azure") ? "Azure" : "cloud"} environments`);
      } else if (term.includes("threat") || term.includes("intelligence")) {
        responsibilities.push(`${sample(verbs.development)} threat intelligence program to proactively identify and ${sample(verbs.execution)} emerging security threats before they impacted the organization`);
      } else {
        responsibilities.push(`${sample(verbs.execution)} ${term} initiatives to strengthen security controls and ${sample(verbs.management)} organizational risk`);
      }
    }
  });
  
  // Add responsibilities based on skills
  relevantSkills.forEach((skill, index) => {
    if (index < 2 && !responsibilities.some(r => r.toLowerCase().includes(skill.toLowerCase()))) {
      responsibilities.push(`${sample(verbs.leadership)} implementation of ${skill} solutions, resulting in enhanced security posture and ${experienceLevel === "senior" ? "strategic advantages" : "operational improvements"}`);
    }
  });
  
  // Add quantifiable achievements
  const achievements = [
    `Reduced mean time to detect security incidents by 65% through implementation of ${sample(relevantSkills)} and ${sample(keyTerms)}`,
    `Achieved 99.9% compliance with ${keyTerms.find(t => t.includes("ISO") || t.includes("NIST") || t.includes("SOC")) || "security standards"} across all systems and processes`,
    `Decreased successful phishing attempts by 80% through implementation of ${keyTerms.includes("training") ? "security awareness training" : "comprehensive security controls"}`,
    `Eliminated critical vulnerabilities within 24 hours of detection, exceeding industry standard by 67%`
  ];
  
  responsibilities.push(sample(achievements));
  
  // Ensure all responsibilities are unique
  return [...new Set(responsibilities)].slice(0, 8);
};

/**
 * Get appropriate verbs based on experience level
 */
const getVerbsByExperienceLevel = (experienceLevel: string) => {
  const verbs = {
    junior: {
      execution: ["Assisted with", "Supported", "Helped implement", "Participated in", "Contributed to"],
      development: ["Helped develop", "Assisted in creating", "Contributed to building", "Supported development of", "Aided in establishing"],
      planning: ["Helped plan", "Assisted in designing", "Supported creation of", "Contributed to planning", "Participated in designing"],
      collaboration: ["Worked with", "Collaborated with", "Participated with", "Engaged with", "Interacted with"],
      management: ["Helped manage", "Assisted in overseeing", "Supported management of", "Helped coordinate", "Assisted in handling"],
      leadership: ["Participated in leading", "Supported leadership of", "Assisted in guiding", "Helped direct", "Contributed to leading"]
    },
    mid: {
      execution: ["Implemented", "Conducted", "Executed", "Performed", "Deployed"],
      development: ["Developed", "Created", "Established", "Built", "Designed"],
      planning: ["Planned", "Designed", "Formulated", "Architected", "Structured"],
      collaboration: ["Collaborated with", "Partnered with", "Worked with", "Coordinated with", "Engaged with"],
      management: ["Managed", "Oversaw", "Coordinated", "Handled", "Administered"],
      leadership: ["Led", "Guided", "Directed", "Spearheaded", "Championed"]
    },
    senior: {
      execution: ["Strategically implemented", "Orchestrated", "Expertly executed", "Masterminded", "Skillfully deployed"],
      development: ["Architected", "Pioneered", "Innovated", "Engineered", "Masterminded"],
      planning: ["Strategically designed", "Crafted", "Orchestrated", "Conceptualized", "Envisioned"],
      collaboration: ["Led collaboration with", "Directed engagement with", "Orchestrated partnerships with", "Established relationships with", "Fostered cooperation with"],
      management: ["Directed", "Strategically managed", "Led", "Oversaw", "Orchestrated"],
      leadership: ["Spearheaded", "Pioneered", "Led", "Directed", "Championed"]
    }
  };
  
  if (experienceLevel === "junior") return verbs.junior;
  if (experienceLevel === "senior") return verbs.senior;
  return verbs.mid;
};

/**
 * Pick a random item from an array
 */
const sample = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
