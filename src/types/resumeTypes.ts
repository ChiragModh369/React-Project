import { z } from 'zod';

export const resumeTemplates = [
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=300',
    description: 'Clean and professional design with a modern touch'
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=300',
    description: 'Stand out with a creative and unique layout'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    thumbnail: 'https://images.unsplash.com/photo-1586282391129-76aa6df230234?q=80&w=300',
    description: 'Simple and elegant design focusing on content'
  },
  {
    id: 'professional',
    name: 'Professional',
    thumbnail: 'https://images.unsplash.com/photo-1586282023338-52aa6c1074c4?q=80&w=300',
    description: 'Traditional resume format with a professional look'
  }
];

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  location: z.string().min(2, 'Location is required'),
  title: z.string().min(2, 'Professional title is required'),
  summary: z.string().min(50, 'Please provide a detailed summary (min 50 characters)'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal(''))
});

const experienceSchema = z.object({
  experienceId: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().min(1, 'Description is required'),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required'),
  degree: z.string().min(2, 'Degree is required'),
  year: z.string().min(4, 'Year is required (e.g., 2020)'),
  description: z.string().optional()
});

export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  category: z.string().optional()
});

export const resumeSchema = z.object({
  template: z.string(),
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  languages: z.array(z.object({
    name: z.string(),
    level: z.string()
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: z.string().optional()
  })).optional()
});

export type ResumeTemplate = {
  id: string;
  template_name: string;
  preview_image: string;
  description: string;
};

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Resume = z.infer<typeof resumeSchema>;