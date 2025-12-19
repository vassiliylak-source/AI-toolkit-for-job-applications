
import type { TailoredCV, CvTemplate } from '../types';
import { escapeHtml } from './textUtils';

// --- Shared Styles & Helpers ---

const COMMON_STYLES = `
    body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1f2937; line-height: 1.4; margin: 0; padding: 0; }
    table { border-collapse: collapse; width: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; padding: 5px; }
    ul { margin: 2px 0 5px 20px; padding: 0; }
    li { margin-bottom: 2px; }
    h1 { margin: 0 0 5px 0; font-size: 24pt; font-weight: bold; }
    h2 { margin: 15px 0 5px 0; font-size: 14pt; font-weight: bold; page-break-after: avoid; }
    h3 { margin: 0 0 2px 0; font-size: 11pt; font-weight: bold; }
    p { margin: 0 0 5px 0; }
    a { color: #4f46e5; text-decoration: none; }
    .text-small { font-size: 10pt; color: #6b7280; }
    .italic { font-style: italic; }
    .bold { font-weight: bold; }
`;

const createDocShell = (title: string, body: string, extraStyles: string = '') => {
    // The prefix ensures Word treats the file as a true Document rather than a Web Page
    const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${escapeHtml(title)}</title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>100</w:Zoom>
                    <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
            </xml>
            <![endif]-->
            <style>
                @page { size: 8.5in 11in; margin: 1in 1in 1in 1in; mso-header-margin: .5in; mso-footer-margin: .5in; mso-paper-source: 0; }
                ${COMMON_STYLES}
                ${extraStyles}
            </style>
        </head>
        <body>
            ${body}
        </body>
        </html>
    `;
    return header.trim();
};

const renderSection = (title: string, content: string) => {
    if (!content.trim()) return '';
    return `<h2>${escapeHtml(title)}</h2>${content}`;
};

const renderOptionalSections = (cv: TailoredCV) => {
    let sections = '';
    
    if (cv.professionalDevelopment && cv.professionalDevelopment.length > 0) {
        sections += renderSection('Professional Development', cv.professionalDevelopment.map(pd => `
            <div style="margin-bottom: 5px;">
                <p><strong>${escapeHtml(pd.name)}</strong>${pd.date ? `<span style="float:right;">${escapeHtml(pd.date)}</span>` : ''}</p>
                ${pd.institution ? `<p class="italic text-small">${escapeHtml(pd.institution)}</p>` : ''}
            </div>
        `).join(''));
    }

    if (cv.certifications && cv.certifications.length > 0) {
        sections += renderSection('Certifications', cv.certifications.map(cert => `
            <div style="margin-bottom: 5px;">
                <p><strong>${escapeHtml(cert.name)}</strong>${cert.date ? `<span style="float:right;">${escapeHtml(cert.date)}</span>` : ''}</p>
                ${cert.issuer ? `<p class="italic text-small">${escapeHtml(cert.issuer)}</p>` : ''}
            </div>
        `).join(''));
    }

    if (cv.publications && cv.publications.length > 0) {
        sections += renderSection('Publications', cv.publications.map(pub => `
            <div style="margin-bottom: 5px;">
                <p><strong>${escapeHtml(pub.title)}</strong>${pub.date ? `<span style="float:right;">${escapeHtml(pub.date)}</span>` : ''}</p>
                ${pub.journal ? `<p class="italic text-small">${escapeHtml(pub.journal)}</p>` : ''}
            </div>
        `).join(''));
    }

    if (cv.awards && cv.awards.length > 0) {
        sections += renderSection('Awards', cv.awards.map(award => `
            <div style="margin-bottom: 5px;">
                <p><strong>${escapeHtml(award.name)}</strong>${award.date ? `<span style="float:right;">${escapeHtml(award.date)}</span>` : ''}</p>
                ${award.issuer ? `<p class="italic text-small">${escapeHtml(award.issuer)}</p>` : ''}
            </div>
        `).join(''));
    }

    return sections;
};

// --- Template Generators ---

const generateModern = (cv: TailoredCV) => {
    const styles = `h2 { border-bottom: 2px solid #4f46e5; padding-bottom: 3px; }`;
    const body = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1>${escapeHtml(cv.name)}</h1>
            <p class="text-small">${escapeHtml(cv.contact.email)}${cv.contact.phone ? ` • ${escapeHtml(cv.contact.phone)}` : ''}${cv.contact.linkedin ? ` • ${escapeHtml(cv.contact.linkedin)}` : ''}</p>
        </div>
        <h2>Summary</h2><p>${escapeHtml(cv.summary)}</p>
        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <div style="margin-bottom: 10px;">
                <table width="100%"><tr><td><h3>${escapeHtml(exp.jobTitle)}</h3></td><td style="text-align:right;">${escapeHtml(exp.dates)}</td></tr></table>
                <p class="italic text-small">${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</p>
                <ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
            </div>
        `).join('')}
        <h2>Education</h2>
        ${cv.education.map(edu => `
            <div style="margin-bottom: 8px;">
                <table width="100%"><tr><td><h3>${escapeHtml(edu.degree)}</h3></td><td style="text-align:right;">${escapeHtml(edu.dates)}</td></tr></table>
                <p class="italic text-small">${escapeHtml(edu.institution)} - ${escapeHtml(edu.location)}</p>
            </div>
        `).join('')}
        ${renderOptionalSections(cv)}
        <h2>Skills</h2><p>${cv.skills.join(' • ')}</p>
    `;
    return createDocShell(cv.name, body, styles);
};

const generateClassic = (cv: TailoredCV) => {
    const styles = `body { font-family: "Times New Roman", serif; } h1 { text-align: center; text-transform: uppercase; } h2 { border-bottom: 1px solid #000; text-transform: uppercase; }`;
    const body = `
        <div style="text-align: center; border-bottom: 2px solid #000; margin-bottom: 20px;">
            <h1>${escapeHtml(cv.name)}</h1>
            <p>${escapeHtml(cv.contact.email)}${cv.contact.phone ? ` | ${escapeHtml(cv.contact.phone)}` : ''}</p>
        </div>
        <h2>Summary</h2><p>${escapeHtml(cv.summary)}</p>
        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <div style="margin-bottom: 12px;">
                <table width="100%"><tr><td><h3>${escapeHtml(exp.jobTitle)}</h3></td><td style="text-align:right;">${escapeHtml(exp.dates)}</td></tr></table>
                <p class="italic">${escapeHtml(exp.company)}, ${escapeHtml(exp.location)}</p>
                <ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
            </div>
        `).join('')}
        <h2>Education</h2>
        ${cv.education.map(edu => `
            <div style="margin-bottom: 8px;">
                <table width="100%"><tr><td><h3>${escapeHtml(edu.degree)}</h3></td><td style="text-align:right;">${escapeHtml(edu.dates)}</td></tr></table>
                <p class="italic">${escapeHtml(edu.institution)}, ${escapeHtml(edu.location)}</p>
            </div>
        `).join('')}
        ${renderOptionalSections(cv)}
        <h2>Skills</h2><p>${cv.skills.join(' | ')}</p>
    `;
    return createDocShell(cv.name, body, styles);
};

const generateCreative = (cv: TailoredCV) => {
    const body = `
        <table width="100%">
            <tr>
                <td width="30%" bgcolor="#1f2937" style="background-color: #1f2937; color: #fff; padding: 20px;">
                    <h1 style="color: #fff;">${escapeHtml(cv.name)}</h1>
                    <p style="color: #a78bfa; font-weight: bold; margin-top: 20px;">CONTACT</p>
                    <p class="text-small" style="color: #fff;">${escapeHtml(cv.contact.email)}</p>
                    <p style="color: #a78bfa; font-weight: bold; margin-top: 20px;">EDUCATION</p>
                    ${cv.education.map(edu => `<p style="color: #fff; font-size: 10pt;">${escapeHtml(edu.degree)}<br/><span style="color: #ccc;">${escapeHtml(edu.institution)}</span></p>`).join('')}
                    <p style="color: #a78bfa; font-weight: bold; margin-top: 20px;">SKILLS</p>
                    <p style="color: #fff; font-size: 10pt;">${cv.skills.join('<br/>')}</p>
                </td>
                <td width="70%" style="padding: 20px;">
                    <h2 style="border-bottom: 2px solid #eee;">Summary</h2><p>${escapeHtml(cv.summary)}</p>
                    <h2 style="border-bottom: 2px solid #eee;">Experience</h2>
                    ${cv.experience.map(exp => `
                        <h3>${escapeHtml(exp.jobTitle)}</h3>
                        <p class="italic text-small">${escapeHtml(exp.company)} - ${escapeHtml(exp.dates)}</p>
                        <ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
                    `).join('')}
                    ${renderOptionalSections(cv)}
                </td>
            </tr>
        </table>
    `;
    return createDocShell(cv.name, body);
};

const generateMinimalist = (cv: TailoredCV) => {
    const styles = `h1 { font-weight: 300; letter-spacing: 2px; } h2 { font-size: 10pt; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; }`;
    const body = `
        <h1>${escapeHtml(cv.name)}</h1>
        <p class="text-small">${escapeHtml(cv.contact.email)} / ${escapeHtml(cv.contact.phone)}</p>
        <p style="margin-top: 20px;">${escapeHtml(cv.summary)}</p>
        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <h3>${escapeHtml(exp.jobTitle)} at ${escapeHtml(exp.company)}</h3>
            <p class="text-small">${escapeHtml(exp.dates)}</p>
            <ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        `).join('')}
        <h2>Education</h2>
        ${cv.education.map(edu => `<p><strong>${escapeHtml(edu.degree)}</strong> - ${escapeHtml(edu.institution)} (${escapeHtml(edu.dates)})</p>`).join('')}
        ${renderOptionalSections(cv)}
        <h2>Skills</h2><p>${cv.skills.join(', ')}</p>
    `;
    return createDocShell(cv.name, body, styles);
};

const generateCorporate = (cv: TailoredCV) => {
    const body = `
        <table width="100%"><tr bgcolor="#1f2937" style="background-color:#1f2937; color:#fff;"><td style="padding:20px;"><h1>${escapeHtml(cv.name)}</h1></td></tr></table>
        <table width="100%" style="margin-top:20px;">
            <tr>
                <td width="30%" style="border-right: 1px solid #eee; padding-right: 20px;">
                    <h2 style="color: #4f46e5; font-size: 10pt;">CONTACT</h2><p>${escapeHtml(cv.contact.email)}</p>
                    <h2 style="color: #4f46e5; font-size: 10pt;">EDUCATION</h2>${cv.education.map(edu => `<p>${escapeHtml(edu.degree)}<br/>${escapeHtml(edu.institution)}</p>`).join('')}
                    <h2 style="color: #4f46e5; font-size: 10pt;">SKILLS</h2><ul>${cv.skills.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
                </td>
                <td width="70%" style="padding-left: 20px;">
                    <h2 style="border-bottom: 1px solid #eee;">Summary</h2><p>${escapeHtml(cv.summary)}</p>
                    <h2 style="border-bottom: 1px solid #eee;">Experience</h2>
                    ${cv.experience.map(exp => `<h3>${escapeHtml(exp.jobTitle)}</h3><p class="italic">${escapeHtml(exp.company)} | ${escapeHtml(exp.dates)}</p><ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`).join('')}
                    ${renderOptionalSections(cv)}
                </td>
            </tr>
        </table>
    `;
    return createDocShell(cv.name, body);
};

const generateElegant = (cv: TailoredCV) => {
    const styles = `body { font-family: Georgia, serif; } h1 { text-align: center; } h2 { text-align: center; border: none; letter-spacing: 2px; }`;
    const body = `
        <h1>${escapeHtml(cv.name)}</h1><p style="text-align:center;">${escapeHtml(cv.contact.email)}</p>
        <div style="border-top:1px solid #eee; width:100px; margin:20px auto;"></div>
        <p style="font-style:italic; text-align:center;">${escapeHtml(cv.summary)}</p>
        <h2>EXPERIENCE</h2>
        ${cv.experience.map(exp => `<h3>${escapeHtml(exp.jobTitle)}</h3><p style="text-align:center;">${escapeHtml(exp.company)} | ${escapeHtml(exp.dates)}</p><ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`).join('')}
        ${renderOptionalSections(cv)}
        <h2>EDUCATION</h2>${cv.education.map(edu => `<p style="text-align:center;">${escapeHtml(edu.degree)} - ${escapeHtml(edu.institution)}</p>`).join('')}
        <h2>SKILLS</h2><p style="text-align:center;">${cv.skills.join(' • ')}</p>
    `;
    return createDocShell(cv.name, body, styles);
};

const generateTech = (cv: TailoredCV) => {
    const styles = `body { font-family: "Courier New", monospace; } h1 { color: #22d3ee; } h2 { color: #22d3ee; border-bottom: 1px solid #333; }`;
    const body = `
        <table width="100%">
            <tr bgcolor="#111"><td style="padding:20px;"><h1>${escapeHtml(cv.name)}</h1><p style="color:#22d3ee;">&gt; ${escapeHtml(cv.experience[0]?.jobTitle)}</p></td></tr>
            <tr><td style="padding:20px;">
                <h2>README.md</h2><p>${escapeHtml(cv.summary)}</p>
                <h2>COMMIT HISTORY</h2>
                ${cv.experience.map(exp => `<h3>${escapeHtml(exp.jobTitle)}</h3><p>${escapeHtml(exp.company)} [${escapeHtml(exp.dates)}]</p><ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`).join('')}
                ${renderOptionalSections(cv)}
                <h2>SYSTEM STATS</h2><p>${cv.skills.join(' | ')}</p>
            </td></tr>
        </table>
    `;
    return createDocShell(cv.name, body, styles);
};

const generateInfographic = (cv: TailoredCV) => {
    const body = `
        <h1>${escapeHtml(cv.name)}</h1><p>${escapeHtml(cv.experience[0]?.jobTitle)}</p>
        <table width="100%">
            <tr>
                <td width="66%">
                    <h2>Summary</h2><p>${escapeHtml(cv.summary)}</p>
                    <h2>Experience</h2>${cv.experience.map(exp => `<h3>${escapeHtml(exp.jobTitle)}</h3><p>${escapeHtml(exp.company)} [${escapeHtml(exp.dates)}]</p><ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`).join('')}
                    ${renderOptionalSections(cv)}
                </td>
                <td width="33%" bgcolor="#f9fafb" style="padding:15px;">
                    <h3>Contact</h3><p>${escapeHtml(cv.contact.email)}</p>
                    <h3>Education</h3>${cv.education.map(edu => `<p>${escapeHtml(edu.degree)}</p>`).join('')}
                    <h3>Skills</h3>${cv.skills.map(s => `<p>• ${escapeHtml(s)}</p>`).join('')}
                </td>
            </tr>
        </table>
    `;
    return createDocShell(cv.name, body);
};

const generateBold = (cv: TailoredCV) => {
    const styles = `body { border-left: 10px solid #7c3aed; padding-left: 20px; } h1 { font-size: 32pt; } h2 { color: #7c3aed; }`;
    const body = `
        <h1>${escapeHtml(cv.name)}</h1><p>${escapeHtml(cv.contact.email)}</p>
        <h2>SUMMARY</h2><p>${escapeHtml(cv.summary)}</p>
        <h2>EXPERIENCE</h2>${cv.experience.map(exp => `<h3>${escapeHtml(exp.jobTitle)}</h3><p>${escapeHtml(exp.company)} | ${escapeHtml(exp.dates)}</p><ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`).join('')}
        ${renderOptionalSections(cv)}
        <h2>EDUCATION</h2>${cv.education.map(edu => `<p>${escapeHtml(edu.degree)}</p>`).join('')}
        <h2>SKILLS</h2><p>${cv.skills.join(' • ')}</p>
    `;
    return createDocShell(cv.name, body, styles);
};

// --- Main Export ---

export const getUniversalDocHtml = (cvData: TailoredCV, template: CvTemplate): string => {
    switch (template) {
        case 'modern': return generateModern(cvData);
        case 'classic': return generateClassic(cvData);
        case 'creative': return generateCreative(cvData);
        case 'minimalist': return generateMinimalist(cvData);
        case 'corporate': return generateCorporate(cvData);
        case 'elegant': return generateElegant(cvData);
        case 'tech': return generateTech(cvData);
        case 'infographic': return generateInfographic(cvData);
        case 'bold': return generateBold(cvData);
        default: return generateModern(cvData);
    }
};

export const getInterviewPrepAsHtml = (title: string, data: { question: string; answer:string; }[]): string => {
    const body = `
        <div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333;">
            <h1 style="font-size: 18pt; color: #000; border-bottom: 2px solid #ddd; padding-bottom: 5px;">${escapeHtml(title)}</h1>
            ${data.map(item => `
                <div style="margin-top: 20px; page-break-inside: avoid;">
                    <h2 style="font-size: 13pt; color: #4f46e5; margin-bottom: 8px;">${escapeHtml(item.question)}</h2>
                    <p style="font-size: 11pt; color: #333;">${escapeHtml(item.answer).replace(/\n/g, '<br />')}</p>
                </div>
            `).join('')}
        </div>
    `;
    return createDocShell(title, body);
};

export const cvToPlainText = (cv: TailoredCV): string => {
    if (!cv) return "No CV data available.";
    let text = `TAILORED CV\n====================\n\n${cv.name}\n${cv.contact.email}`;
    if (cv.contact.phone) text += ` | ${cv.contact.phone}`;
    text += `\n\n--- SUMMARY ---\n${cv.summary}\n`;
    if (cv.experience?.length > 0) {
        text += `\n--- EXPERIENCE ---\n`;
        cv.experience.forEach(exp => {
            text += `\n${exp.jobTitle} | ${exp.company} (${exp.dates})\n`;
            exp.responsibilities.forEach(resp => { text += `  - ${resp}\n`; });
        });
    }
    if (cv.education?.length > 0) {
        text += `\n--- EDUCATION ---\n`;
        cv.education.forEach(edu => { text += `${edu.degree} | ${edu.institution} (${edu.dates})\n`; });
    }
    if (cv.skills?.length > 0) text += `\n--- SKILLS ---\n${cv.skills.join(', ')}\n`;
    return text;
};
