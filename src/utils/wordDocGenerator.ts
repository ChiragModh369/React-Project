
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';

interface CVData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experiences: {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  educations: {
    id: string;
    degree: string;
    institution: string;
    year: string;
  }[];
  skills: {
    id: string;
    name: string;
  }[];
}

export const generateWordDocument = async (cvData: CVData): Promise<Blob> => {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Name as heading
          new Paragraph({
            text: cvData.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          
          // Contact info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: cvData.email || '', size: 24 }),
              ...(cvData.email && cvData.phone ? [new TextRun({ text: ' • ', size: 24 })] : []),
              new TextRun({ text: cvData.phone || '', size: 24 }),
            ],
          }),
          
          // Spacing
          new Paragraph({ text: "" }),
          
          // Summary section
          ...(cvData.summary ? [
            new Paragraph({
              text: "PROFESSIONAL SUMMARY",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            new Paragraph({ text: cvData.summary }),
            new Paragraph({ text: "" }),
          ] : []),
          
          // Experience section
          ...(cvData.experiences.length > 0 ? [
            new Paragraph({
              text: "EXPERIENCE",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            ...cvData.experiences.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.title, bold: true }),
                  new TextRun({ text: " | " }),
                  new TextRun({ text: exp.company }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${exp.startDate} - ${exp.endDate || 'Present'}`, italics: true }),
                ],
              }),
              new Paragraph({ text: exp.description }),
              new Paragraph({ text: "" }),
            ]),
          ] : []),
          
          // Education section
          ...(cvData.educations.length > 0 ? [
            new Paragraph({
              text: "EDUCATION",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            ...cvData.educations.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: edu.institution }),
                  new TextRun({ text: " | " }),
                  new TextRun({ text: edu.year, italics: true }),
                ],
              }),
              new Paragraph({ text: "" }),
            ]),
          ] : []),
          
          // Skills section
          ...(cvData.skills.length > 0 ? [
            new Paragraph({
              text: "SKILLS",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            new Paragraph({
              children: cvData.skills.map((skill, index, array) => 
                new TextRun({
                  text: index === array.length - 1 ? skill.name : `${skill.name}, `,
                })
              ),
            }),
          ] : []),
        ],
      },
    ],
  });
  
  // Generate and return the document as a blob
  return await Packer.toBlob(doc);
};
