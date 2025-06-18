import React, { useMemo } from 'react';
import type { Resume, ResumeTemplate } from '@/types/resumeTypes';
import { showLog } from '@/commonFunctions/Functions';

interface ResumePreviewProps {
  resume: Resume;
  template: ResumeTemplate;
}

export const renderResumeHTML = (html: string, data: Resume): string => {
  if (!html) return '';

  let rendered = html;

  // Personal Info
  for (const [key, value] of Object.entries(data.personalInfo)) {
    const safeValue = typeof value === 'string' ? value.replace(/</g, '<').replace(/>/g, '>') : '';
    rendered = rendered.replaceAll(`{{${key}}}`, safeValue);
  }

  // Experiences
  const experienceHTML = data.experiences
    .map(
      (exp, index) => `
      <div key=${index}>
        <p><strong>${exp.position || ''} - ${exp.company || ''}</strong> (${exp.startDate || ''} – ${
        exp.current ? 'Present' : exp.endDate || ''
      })</p>
        <ul>
          ${exp.description
            ? exp.description
                .split('\n')
                .map((desc) => `<li>${desc}</li>`)
                .join('')
            : ''}
        </ul>
      </div>
    `
    )
    .join('');
  rendered = rendered.replace('{{Experiences}}', experienceHTML);

  // Education
  const educationHTML = data.education
    .map(
      (edu, index) => `
      <p key=${index}><strong>${edu.degree || ''} - ${edu.institution || ''}</strong> (${edu.year || ''})</p>
      ${edu.description ? `<p>${edu.description}</p>` : ''}
    `
    )
    .join('');
  rendered = rendered.replace('{{Education}}', educationHTML);

  // Skills (Technical, Soft, Languages)
  const technicalSkillsHTML = data.skills
    .filter((skill) => skill.category === 'Technical Skills')
    .map(
      (skill, index) => `
      <div class="item" key=${index}>
        <p>${skill.name || ''}</p>
        <div class="skills-bar">
          <div class="bar"><div class="bar-fill" style="width: ${
            skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '75%' : skill.level === 'Intermediate' ? '60%' : '40%'
          };"></div></div>
          <span class="level-label">${skill.level || ''}</span>
        </div>
      </div>
    `
    )
    .join('');
  rendered = rendered.replace('{{TechnicalSkills}}', technicalSkillsHTML);

  const softSkillsHTML = data.skills
    .filter((skill) => skill.category === 'Soft Skills')
    .map(
      (skill, index) => `
      <div class="item" key=${index}>
        <p>${skill.name || ''}</p>
        <div class="skills-bar">
          <div class="bar"><div class="bar-fill" style="width: ${
            skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '75%' : skill.level === 'Intermediate' ? '60%' : '40%'
          };"></div></div>
          <span class="level-label">${skill.level || ''}</span>
        </div>
      </div>
    `
    )
    .join('');
  rendered = rendered.replace('{{SoftSkills}}', softSkillsHTML);

  const languagesHTML = data.skills
    .filter((skill) => skill.category === 'Languages')
    .map(
      (skill, index) => `
      <div class="item" key=${index}>
        <p>${skill.name || ''}</p>
        <div class="skills-bar">
          <div class="bar"><div class="bar-fill" style="width: ${
            skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '60%' : '40%'
          };"></div></div>
          <span class="level-label">${skill.level || ''}</span>
        </div>
      </div>
    `
    )
    .join('');
  rendered = rendered.replace('{{Languages}}', languagesHTML);

  return rendered;
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, template }) => {
  const htmlContent = template?.html_content || '';
  const renderedHTML = renderResumeHTML(htmlContent, resume);

  const hasData =
    (resume.personalInfo.fullName || resume.personalInfo.email) ||
    resume.experiences.length > 0 ||
    resume.education.length > 0 ||
    resume.skills.length > 0;

  const iframeContent = useMemo(() => {
    if (!hasData) {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Preview</title>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
              background: #fff;
              overflow-x: auto;
            }
            p {
              text-align: center;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <p>Fill in your details to preview your resume</p>
        </body>
        </html>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Preview</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: #fff;
          }
          .resume-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${renderedHTML}
        </div>
      </body>
      </html>
    `;
  }, [renderedHTML, hasData]);

  return (
    <div className="relative w-full flex justify-center">
      {/* Wrapper to handle scaling */}
      <div
        style={{
          transform: 'scale(0.64)',
          transformOrigin: 'top center',
          width: '930px', // 595 / 0.64 = ~930px
          height: '1315px', // 842 / 0.64 = ~1315px
        }}
      >
        <iframe
          title="Resume Preview"
          srcDoc={iframeContent}
          className="rounded-md border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
          style={{
            width: '595px', // A4 width in pixels at 72dpi
            height: '842px', // A4 height in pixels at 72dpi
            background: '#fff',
            boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1), -2px -2px 10px rgba(255, 255, 255, 0.5)',
            overflowX: 'auto', // Ensure iframe can scroll
          }}
          scrolling="yes"
        />
        <div
          className="absolute bottom-0 right-0 w-0 h-0 border-[0_0_30px_30px] border-transparent border-r-gray-200 border-b-gray-200"
          style={{
            transformOrigin: 'bottom right',
            boxShadow: '-2px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
    </div>
  );
};

export default ResumePreview;