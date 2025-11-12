
import type { TailoredCV } from '../types';
import { escapeHtml } from './textUtils';

export const getUniversalDocHtml = (cvData: TailoredCV): string => {
    const styles = {
        h1: 'font-size: 24pt; font-weight: bold; color: #111827; text-align: center; margin-bottom: 4px;',
        contact: 'font-size: 10pt; text-align: center; color: #4b5563; margin-bottom: 20px;',
        h2: 'font-size: 14pt; font-weight: bold; color: #111827; border-bottom: 1px solid #374151; padding-bottom: 4px; margin-top: 20px; margin-bottom: 12px;',
        p: 'font-size: 11pt; line-height: 1.4;',
        ul: 'margin-top: 5px; padding-left: 20px; font-size: 11pt; line-height: 1.4;',
        jobTitle: 'font-size: 12pt; font-weight: bold; color: #1f2937;',
        company: 'font-style: italic; font-size: 11pt; color: #4b5563;',
        dates: 'font-size: 10pt; color: #4b5563; text-align: right;',
    };

    const section = (title: string, content: string) => {
        if (!content) return '';
        return `
            <div style="page-break-inside: avoid;">
                <h2 style="${styles.h2}">${title}</h2>
                ${content}
            </div>
        `;
    };
    
    const contactInfo = `
        ${escapeHtml(cvData.contact.email)}
        ${cvData.contact.phone ? ` &bull; ${escapeHtml(cvData.contact.phone)}` : ''}
        ${cvData.contact.linkedin ? ` &bull; ${escapeHtml(cvData.contact.linkedin)}` : ''}
    `;

    const summarySection = section('Summary', `<p style="${styles.p}">${escapeHtml(cvData.summary)}</p>`);

    const experienceContent = cvData.experience.map(exp => `
        <div style="margin-bottom: 16px; page-break-inside: avoid;">
            <table width="100%" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding:0; margin:0;"><p style="margin:0; padding:0; ${styles.jobTitle}">${escapeHtml(exp.jobTitle)}</p></td>
                    <td style="padding:0; margin:0; ${styles.dates}">${escapeHtml(exp.dates)}</td>
                </tr>
            </table>
            <p style="margin: 2px 0 5px 0; padding:0; ${styles.company}">${escapeHtml(exp.company)}, ${escapeHtml(exp.location)}</p>
            <ul style="${styles.ul}">
                ${exp.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
            </ul>
        </div>
    `).join('');
    const experienceSection = section('Experience', experienceContent);

    const educationContent = cvData.education.map(edu => `
        <div style="margin-bottom: 8px;">
            <table width="100%" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding:0; margin:0;"><p style="margin:0; padding:0; ${styles.jobTitle}">${escapeHtml(edu.degree)}</p></td>
                    <td style="padding:0; margin:0; ${styles.dates}">${escapeHtml(edu.dates)}</td>
                </tr>
            </table>
            <p style="margin: 2px 0; padding:0; ${styles.company}">${escapeHtml(edu.institution)}, ${escapeHtml(edu.location)}</p>
        </div>
    `).join('');
    const educationSection = section('Education', educationContent);

    const skillsContent = `<p style="${styles.p}">${cvData.skills.map(skill => escapeHtml(skill)).join(' &bull; ')}</p>`;
    const skillsSection = section('Skills', skillsContent);

    const devContent = cvData.professionalDevelopment?.map(pd => `<p style="${styles.p}"><strong>${escapeHtml(pd.name)}</strong>${pd.institution ? `, <em>${escapeHtml(pd.institution)}</em>` : ''}${pd.date ? ` (${escapeHtml(pd.date)})` : ''}</p>`).join('');
    const devSection = devContent ? section('Professional Development', devContent) : '';
    
    const certContent = cvData.certifications?.map(c => `<p style="${styles.p}"><strong>${escapeHtml(c.name)}</strong>${c.issuer ? `, <em>${escapeHtml(c.issuer)}</em>` : ''}${c.date ? ` (${escapeHtml(c.date)})` : ''}</p>`).join('');
    const certSection = certContent ? section('Certifications', certContent) : '';

    const pubContent = cvData.publications?.map(p => `<p style="${styles.p}"><strong>"${escapeHtml(p.title)}"</strong>${p.journal ? `, <em>${escapeHtml(p.journal)}</em>` : ''}${p.date ? ` (${escapeHtml(p.date)})` : ''}</p>`).join('');
    const pubSection = pubContent ? section('Publications', pubContent) : '';
    
    const awardContent = cvData.awards?.map(a => `<p style="${styles.p}"><strong>${escapeHtml(a.name)}</strong>${a.issuer ? `, <em>${escapeHtml(a.issuer)}</em>` : ''}${a.date ? ` (${escapeHtml(a.date)})` : ''}</p>`).join('');
    const awardSection = awardContent ? section('Awards', awardContent) : '';


    return `
        <div style="font-family: Arial, sans-serif;">
            <h1 style="${styles.h1}">${escapeHtml(cvData.name)}</h1>
            <p style="${styles.contact}">${contactInfo}</p>
            ${summarySection}
            ${experienceSection}
            ${educationSection}
            ${devSection}
            ${certSection}
            ${pubSection}
            ${awardSection}
            ${skillsSection}
        </div>
    `;
};

export const getInterviewPrepAsHtml = (title: string, data: { question: string; answer:string; }[]): string => {
    let html = `<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333;">`;
    html += `<h1 style="font-size: 18pt; color: #000; border-bottom: 2px solid #ddd; padding-bottom: 5px;">${escapeHtml(title)}</h1>`;

    data.forEach(item => {
        html += `<div style="margin-top: 20px; page-break-inside: avoid;">`;
        html += `<h2 style="font-size: 13pt; color: #4f46e5; margin-bottom: 8px;">${escapeHtml(item.question)}</h2>`;
        const formattedAnswer = escapeHtml(item.answer).replace(/\n/g, '<br />');
        html += `<p style="font-size: 11pt; color: #333;">${formattedAnswer}</p>`;
        html += `</div>`;
    });

    html += `</div>`;
    return html;
};

export const cvToPlainText = (cv: TailoredCV): string => {
    if (!cv) return "No CV data available.";
    
    let text = `TAILORED CV\n====================\n\n`;
    text += `${cv.name}\n`;
    text += `${cv.contact.email}`;
    if (cv.contact.phone) text += ` | ${cv.contact.phone}`;
    if (cv.contact.linkedin) text += ` | ${cv.contact.linkedin}`;
    text += `\n\n--- SUMMARY ---\n${cv.summary}\n`;

    if (cv.experience?.length > 0) {
        text += `\n--- EXPERIENCE ---\n`;
        cv.experience.forEach(exp => {
        text += `\n${exp.jobTitle} | ${exp.company}, ${exp.location} (${exp.dates})\n`;
        exp.responsibilities.forEach(resp => {
            text += `  - ${resp}\n`;
        });
        });
    }

    if (cv.education?.length > 0) {
        text += `\n--- EDUCATION ---\n`;
        cv.education.forEach(edu => {
        text += `\n${edu.degree} | ${edu.institution}, ${edu.location} (${edu.dates})\n`;
        });
    }
    
    if (cv.professionalDevelopment?.length > 0) {
        text += `\n--- PROFESSIONAL DEVELOPMENT ---\n`;
        cv.professionalDevelopment.forEach(pd => {
            text += `${pd.name}${pd.institution ? ` (${pd.institution})` : ''}${pd.date ? ` - ${pd.date}` : ''}\n`;
        });
    }
    
    if (cv.certifications?.length > 0) {
        text += `\n--- CERTIFICATIONS ---\n`;
        cv.certifications.forEach(cert => {
            text += `${cert.name}${cert.issuer ? ` (${cert.issuer})` : ''}${cert.date ? ` - ${cert.date}` : ''}\n`;
        });
    }

    if (cv.publications?.length > 0) {
        text += `\n--- PUBLICATIONS ---\n`;
        cv.publications.forEach(pub => {
            text += `"${pub.title}"${pub.journal ? ` - ${pub.journal}` : ''}${pub.date ? ` (${pub.date})` : ''}\n`;
        });
    }

    if (cv.awards?.length > 0) {
        text += `\n--- AWARDS ---\n`;
        cv.awards.forEach(award => {
            text += `${award.name}${award.issuer ? ` (${award.issuer})` : ''}${award.date ? ` - ${award.date}` : ''}\n`;
        });
    }
    
    if (cv.skills?.length > 0) {
        text += `\n--- SKILLS ---\n${cv.skills.join(', ')}\n`;
    }
    
    return text;
};
