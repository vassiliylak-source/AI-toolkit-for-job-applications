
import type { TailoredCV, CvTemplate } from '../types';
import { escapeHtml } from './textUtils';

// --- Shared Styles & Helpers ---

const COMMON_STYLES = `
    body { font-family: Arial, sans-serif; font-size: 11pt; color: #1f2937; line-height: 1.4; margin: 0; padding: 0; }
    table { border-collapse: collapse; width: 100%; }
    td { vertical-align: top; padding: 5px; }
    ul { margin: 2px 0 5px 20px; padding: 0; }
    li { margin-bottom: 2px; }
    h1 { margin: 0 0 5px 0; font-size: 24pt; font-weight: bold; }
    h2 { margin: 15px 0 5px 0; font-size: 14pt; font-weight: bold; page-break-after: avoid; }
    h3 { margin: 0 0 2px 0; font-size: 11pt; font-weight: bold; }
    p { margin: 0 0 5px 0; }
    .text-small { font-size: 10pt; color: #6b7280; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .italic { font-style: italic; }
    .bold { font-weight: bold; }
    .uppercase { text-transform: uppercase; }
`;

const createDocShell = (title: string, body: string, extraStyles: string = '') => `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset='utf-8'>
        <title>${escapeHtml(title)}</title>
        <style>
            ${COMMON_STYLES}
            ${extraStyles}
        </style>
    </head>
    <body>
        ${body}
    </body>
    </html>
`;

// --- Template Generators ---

const generateModern = (cv: TailoredCV) => {
    const styles = `
        h2 { border-bottom: 2px solid #4f46e5; color: #1f2937; padding-bottom: 3px; }
        .header { text-align: center; margin-bottom: 20px; }
        .tagline { color: #4f46e5; font-weight: bold; }
    `;

    const body = `
        <div class="header">
            <h1 style="color: #111827;">${escapeHtml(cv.name)}</h1>
            <p class="text-small">
                ${escapeHtml(cv.contact.email)}
                ${cv.contact.phone ? ` • ${escapeHtml(cv.contact.phone)}` : ''}
                ${cv.contact.linkedin ? ` • ${escapeHtml(cv.contact.linkedin)}` : ''}
            </p>
        </div>

        <h2>Summary</h2>
        <p>${escapeHtml(cv.summary)}</p>

        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <div style="margin-bottom: 10px;">
                <table width="100%">
                    <tr>
                        <td style="padding:0;"><h3>${escapeHtml(exp.jobTitle)}</h3></td>
                        <td style="padding:0; text-align: right;" class="text-small bold">${escapeHtml(exp.dates)}</td>
                    </tr>
                </table>
                <p class="italic text-small" style="margin-bottom: 2px;">${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</p>
                <ul>
                    ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>
        `).join('')}

        <h2>Education</h2>
        ${cv.education.map(edu => `
            <div style="margin-bottom: 8px;">
                <table width="100%">
                    <tr>
                        <td style="padding:0;"><h3>${escapeHtml(edu.degree)}</h3></td>
                        <td style="padding:0; text-align: right;" class="text-small bold">${escapeHtml(edu.dates)}</td>
                    </tr>
                </table>
                <p class="italic text-small">${escapeHtml(edu.institution)} - ${escapeHtml(edu.location)}</p>
            </div>
        `).join('')}

        <h2>Skills</h2>
        <p>${cv.skills.map(s => escapeHtml(s)).join(' • ')}</p>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateClassic = (cv: TailoredCV) => {
    const styles = `
        body { font-family: "Times New Roman", serif; }
        h1 { font-size: 26pt; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
        h2 { border-bottom: 1px solid #000; text-transform: uppercase; letter-spacing: 1px; font-size: 13pt; margin-top: 20px; color: #000; }
        .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
    `;

    const body = `
        <div class="header">
            <h1>${escapeHtml(cv.name)}</h1>
            <p style="margin-top: 5px;">
                ${escapeHtml(cv.contact.email)}
                ${cv.contact.phone ? ` | ${escapeHtml(cv.contact.phone)}` : ''}
                ${cv.contact.linkedin ? ` | ${escapeHtml(cv.contact.linkedin)}` : ''}
            </p>
        </div>

        <h2>Summary</h2>
        <p>${escapeHtml(cv.summary)}</p>

        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <div style="margin-bottom: 12px;">
                <table width="100%">
                    <tr>
                        <td style="padding:0;"><h3>${escapeHtml(exp.jobTitle)}</h3></td>
                        <td style="padding:0; text-align: right;">${escapeHtml(exp.dates)}</td>
                    </tr>
                </table>
                <p class="italic" style="margin-bottom: 2px;">${escapeHtml(exp.company)}, ${escapeHtml(exp.location)}</p>
                <ul>
                    ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>
        `).join('')}

        <h2>Education</h2>
        ${cv.education.map(edu => `
            <div style="margin-bottom: 8px;">
                <table width="100%">
                    <tr>
                        <td style="padding:0;"><h3>${escapeHtml(edu.degree)}</h3></td>
                        <td style="padding:0; text-align: right;">${escapeHtml(edu.dates)}</td>
                    </tr>
                </table>
                <p class="italic">${escapeHtml(edu.institution)}, ${escapeHtml(edu.location)}</p>
            </div>
        `).join('')}
        
        <h2>Skills</h2>
        <p>${cv.skills.map(s => escapeHtml(s)).join(' | ')}</p>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateCreative = (cv: TailoredCV) => {
    const styles = `
        /* Word handles background colors best in table cells */
        h1 { color: #ffffff; font-size: 28pt; margin-bottom: 20px; }
        .sidebar-h2 { color: #7c3aed; font-size: 12pt; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; margin-top: 20px; }
        .main-h2 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; font-size: 16pt; text-transform: uppercase; margin-top: 20px; }
        .sidebar-text { color: #e5e7eb; font-size: 10pt; }
        .skill-tag { display: inline-block; background-color: #7c3aed; color: #fff; padding: 2px 6px; font-size: 9pt; margin: 2px; border-radius: 4px; }
    `;

    const body = `
        <table width="100%" style="width: 100%; border-collapse: collapse;">
            <tr>
                <!-- SIDEBAR -->
                <td width="35%" style="background-color: #1f2937; padding: 25px; vertical-align: top;">
                    <h1>${escapeHtml(cv.name)}</h1>
                    
                    <div class="sidebar-h2">Contact</div>
                    <div class="sidebar-text">
                        <p>${escapeHtml(cv.contact.email)}</p>
                        ${cv.contact.phone ? `<p>${escapeHtml(cv.contact.phone)}</p>` : ''}
                        ${cv.contact.linkedin ? `<p>${escapeHtml(cv.contact.linkedin)}</p>` : ''}
                    </div>

                    <div class="sidebar-h2">Education</div>
                    ${cv.education.map(edu => `
                        <div style="margin-bottom: 15px;">
                            <p style="color: #fff; font-weight: bold; margin-bottom: 0;">${escapeHtml(edu.degree)}</p>
                            <p style="color: #d1d5db; font-size: 9pt; margin-bottom: 0;">${escapeHtml(edu.institution)}</p>
                            <p style="color: #9ca3af; font-size: 9pt;">${escapeHtml(edu.dates)}</p>
                        </div>
                    `).join('')}

                    <div class="sidebar-h2">Skills</div>
                    <div style="line-height: 1.8;">
                         ${cv.skills.map(s => `<span style="color: #fff; background-color: #7c3aed; padding: 3px 6px; font-size: 9pt; border-radius: 3px;">${escapeHtml(s)}</span> `).join('')}
                    </div>
                </td>

                <!-- MAIN CONTENT -->
                <td width="65%" style="padding: 25px; vertical-align: top; background-color: #ffffff;">
                    <h2 class="main-h2" style="margin-top: 0;">Summary</h2>
                    <p>${escapeHtml(cv.summary)}</p>

                    <h2 class="main-h2">Experience</h2>
                    ${cv.experience.map(exp => `
                        <div style="margin-bottom: 15px;">
                             <table width="100%">
                                <tr>
                                    <td style="padding:0;"><h3>${escapeHtml(exp.jobTitle)}</h3></td>
                                    <td style="padding:0; text-align: right; color: #6b7280; font-size: 10pt;">${escapeHtml(exp.dates)}</td>
                                </tr>
                            </table>
                            <p class="italic text-small">${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</p>
                            <ul>
                                ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                    
                    ${cv.certifications && cv.certifications.length > 0 ? `
                        <h2 class="main-h2">Certifications</h2>
                        ${cv.certifications.map(c => `<p><strong>${escapeHtml(c.name)}</strong> - ${escapeHtml(c.issuer)}</p>`).join('')}
                    ` : ''}
                </td>
            </tr>
        </table>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateMinimalist = (cv: TailoredCV) => {
    const styles = `
        body { font-family: Helvetica, Arial, sans-serif; font-weight: 300; }
        h1 { font-weight: 300; letter-spacing: 3px; font-size: 28pt; margin-bottom: 5px; }
        h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; font-weight: bold; margin-bottom: 10px; border-bottom: none; }
        .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
        .job-title { font-weight: 500; font-size: 12pt; }
        .company { color: #6b7280; font-size: 10pt; }
    `;

    const body = `
        <h1 style="text-align: left;">${escapeHtml(cv.name)}</h1>
        <p class="text-small" style="color: #6b7280;">
             ${escapeHtml(cv.contact.email)}
             ${cv.contact.phone ? ` / ${escapeHtml(cv.contact.phone)}` : ''}
             ${cv.contact.linkedin ? ` / ${escapeHtml(cv.contact.linkedin)}` : ''}
        </p>
        
        <div style="margin-top: 20px;">
             <p>${escapeHtml(cv.summary)}</p>
        </div>

        <div class="divider"></div>

        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <div style="margin-bottom: 15px;">
                <table width="100%">
                    <tr>
                        <td style="padding:0;"><span class="job-title">${escapeHtml(exp.jobTitle)}</span> <span style="color: #6b7280;">at ${escapeHtml(exp.company)}</span></td>
                        <td style="padding:0; text-align: right;" class="text-small">${escapeHtml(exp.dates)}</td>
                    </tr>
                </table>
                <p class="text-small" style="margin-bottom: 4px;">${escapeHtml(exp.location)}</p>
                <ul style="color: #4b5563;">
                    ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>
        `).join('')}

        <div class="divider"></div>

        <table width="100%">
            <tr>
                <td width="50%" valign="top">
                    <h2>Education</h2>
                    ${cv.education.map(edu => `
                        <div style="margin-bottom: 10px;">
                            <p class="bold" style="margin-bottom: 2px;">${escapeHtml(edu.degree)}</p>
                            <p class="text-small" style="margin-bottom: 0;">${escapeHtml(edu.institution)}</p>
                            <p class="text-small" style="color: #9ca3af;">${escapeHtml(edu.dates)}</p>
                        </div>
                    `).join('')}
                </td>
                <td width="50%" valign="top">
                    <h2>Skills</h2>
                    <p style="color: #4b5563;">${cv.skills.join(', ')}</p>
                </td>
            </tr>
        </table>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateCorporate = (cv: TailoredCV) => {
    const styles = `
        .header-bg { background-color: #1f2937; color: #ffffff; padding: 30px; }
        h1 { color: #ffffff; margin: 0; }
        .section-title { font-size: 11pt; color: #4f46e5; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
        .main-title { font-size: 14pt; color: #111827; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; margin-top: 0; }
    `;

    const body = `
        <!-- Header -->
        <table width="100%">
            <tr>
                <td class="header-bg">
                    <h1>${escapeHtml(cv.name)}</h1>
                    <p style="color: #d1d5db; margin-top: 5px; font-size: 12pt;">Aspiring to be your next team member</p>
                </td>
            </tr>
        </table>

        <table width="100%" style="margin-top: 20px;">
            <tr>
                <!-- LEFT COLUMN -->
                <td width="30%" valign="top" style="padding-right: 20px; border-right: 1px solid #e5e7eb;">
                    <div class="section-title">Contact</div>
                    <p class="text-small">${escapeHtml(cv.contact.email)}</p>
                    ${cv.contact.phone ? `<p class="text-small">${escapeHtml(cv.contact.phone)}</p>` : ''}
                    ${cv.contact.linkedin ? `<p class="text-small">${escapeHtml(cv.contact.linkedin)}</p>` : ''}
                    
                    <div style="height: 20px;"></div>

                    <div class="section-title">Education</div>
                    ${cv.education.map(edu => `
                        <div style="margin-bottom: 10px;">
                            <p class="bold" style="font-size: 10pt; margin-bottom: 0;">${escapeHtml(edu.degree)}</p>
                            <p class="text-small" style="margin-bottom: 0;">${escapeHtml(edu.institution)}</p>
                            <p class="text-small" style="color: #9ca3af;">${escapeHtml(edu.dates)}</p>
                        </div>
                    `).join('')}

                    <div style="height: 20px;"></div>

                    <div class="section-title">Skills</div>
                    <ul style="margin-left: 15px; font-size: 10pt;">
                        ${cv.skills.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                    </ul>
                </td>
                
                <!-- RIGHT COLUMN -->
                <td width="70%" valign="top" style="padding-left: 20px;">
                    <h2 class="main-title">Professional Summary</h2>
                    <p>${escapeHtml(cv.summary)}</p>
                    
                    <div style="height: 20px;"></div>

                    <h2 class="main-title">Work Experience</h2>
                    ${cv.experience.map(exp => `
                        <div style="margin-bottom: 15px;">
                            <table width="100%">
                                <tr>
                                    <td style="padding:0;"><h3>${escapeHtml(exp.jobTitle)}</h3></td>
                                    <td style="padding:0; text-align: right; font-size: 10pt; color: #6b7280;">${escapeHtml(exp.dates)}</td>
                                </tr>
                            </table>
                            <p class="italic text-small" style="margin-bottom: 5px;">${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</p>
                            <ul>
                                ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </td>
            </tr>
        </table>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateElegant = (cv: TailoredCV) => {
    const styles = `
        body { font-family: Georgia, serif; color: #374151; }
        h1 { font-family: "Garamond", serif; font-size: 32pt; text-align: center; color: #111827; }
        h2 { text-align: center; font-size: 14pt; letter-spacing: 2px; border-bottom: none; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; }
        .center-text { text-align: center; }
        .separator { border-top: 1px solid #d1d5db; width: 100px; margin: 20px auto; }
        .exp-date { text-align: right; color: #6b7280; font-style: italic; font-size: 10pt; }
        .exp-content { border-left: 1px solid #e5e7eb; padding-left: 15px; }
    `;

    const body = `
        <h1>${escapeHtml(cv.name)}</h1>
        <p class="center-text text-small" style="letter-spacing: 1px;">
            ${escapeHtml(cv.contact.email)}
            ${cv.contact.phone ? ` • ${escapeHtml(cv.contact.phone)}` : ''}
            ${cv.contact.linkedin ? ` • ${escapeHtml(cv.contact.linkedin)}` : ''}
        </p>

        <div class="separator"></div>
        <p class="center-text" style="font-style: italic; max-width: 80%; margin: 0 auto;">${escapeHtml(cv.summary)}</p>
        <div class="separator"></div>

        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <table width="100%" style="margin-bottom: 15px;">
                <tr>
                    <td width="25%" class="exp-date">
                        ${escapeHtml(exp.dates)}<br/>
                        ${escapeHtml(exp.location)}
                    </td>
                    <td width="75%" class="exp-content">
                        <h3 style="font-family: Arial, sans-serif;">${escapeHtml(exp.jobTitle)}</h3>
                        <p class="italic text-small">${escapeHtml(exp.company)}</p>
                        <ul style="margin-top: 5px;">
                            ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                        </ul>
                    </td>
                </tr>
            </table>
        `).join('')}

        <h2>Education & Skills</h2>
        <table width="100%">
            <tr>
                <td width="50%" valign="top">
                     ${cv.education.map(edu => `
                        <div style="margin-bottom: 10px;">
                            <p class="bold" style="margin-bottom: 0;">${escapeHtml(edu.degree)}</p>
                            <p class="italic text-small" style="margin-bottom: 0;">${escapeHtml(edu.institution)}</p>
                            <p class="text-small">${escapeHtml(edu.dates)}</p>
                        </div>
                    `).join('')}
                </td>
                <td width="50%" valign="top" style="text-align: right;">
                    <p>${cv.skills.join(' • ')}</p>
                </td>
            </tr>
        </table>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateTech = (cv: TailoredCV) => {
    const styles = `
        body { font-family: "Courier New", Courier, monospace; }
        h1 { color: #22d3ee; font-size: 24pt; margin-bottom: 5px; }
        h2 { color: #22d3ee; font-size: 14pt; border-bottom: 1px solid #374151; padding-bottom: 5px; margin-top: 20px; text-transform: uppercase; }
        .sidebar-title { color: #ffffff; font-size: 12pt; font-weight: bold; margin-bottom: 10px; margin-top: 20px; text-transform: uppercase; }
        .key { color: #4ade80; }
        .value { color: #fb923c; }
        .comment { color: #6b7280; }
    `;

    const body = `
        <table width="100%" style="width: 100%; border-collapse: collapse;">
            <tr>
                <!-- SIDEBAR -->
                <td width="35%" style="background-color: #111827; padding: 20px; color: #d1d5db; vertical-align: top;">
                    <h1>${escapeHtml(cv.name)}</h1>
                    <p style="color: #22d3ee; margin-bottom: 20px;">&gt; ${escapeHtml(cv.experience[0]?.jobTitle || 'Developer')}</p>

                    <div class="sidebar-title">// Contact</div>
                    <div style="font-size: 10pt;">
                        <p><span class="key">'email'</span>: <span class="value">"${escapeHtml(cv.contact.email)}"</span></p>
                        ${cv.contact.phone ? `<p><span class="key">'phone'</span>: <span class="value">"${escapeHtml(cv.contact.phone)}"</span></p>` : ''}
                        ${cv.contact.linkedin ? `<p><span class="key">'linkedin'</span>: <span class="value">"Link"</span></p>` : ''}
                    </div>

                    <div class="sidebar-title">// Education</div>
                    ${cv.education.map(edu => `
                        <div style="margin-bottom: 15px;">
                            <p style="color: #f3f4f6; font-weight: bold; margin-bottom: 0;">${escapeHtml(edu.degree)}</p>
                            <p style="font-size: 9pt; margin-bottom: 0;">${escapeHtml(edu.institution)}</p>
                            <p style="color: #6b7280; font-size: 9pt;">${escapeHtml(edu.dates)}</p>
                        </div>
                    `).join('')}

                    <div class="sidebar-title">// Skills</div>
                    <p style="font-size: 10pt; color: #22d3ee;">[ ${cv.skills.map(s => `"${escapeHtml(s)}"`).join(', ')} ]</p>
                </td>

                <!-- MAIN CONTENT -->
                <td width="65%" style="padding: 20px; background-color: #ffffff; vertical-align: top;">
                    <h2>README.md</h2>
                    <p>${escapeHtml(cv.summary)}</p>

                    <h2>Commit History (Experience)</h2>
                    ${cv.experience.map(exp => `
                        <div style="margin-bottom: 20px;">
                            <table width="100%">
                                <tr>
                                    <td style="padding:0;"><h3 style="margin:0;">${escapeHtml(exp.jobTitle)}</h3></td>
                                    <td style="padding:0; text-align: right; font-size: 10pt; color: #6b7280;">${escapeHtml(exp.dates)}</td>
                                </tr>
                            </table>
                            <p style="margin-bottom: 5px; font-style: italic;">${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</p>
                            <ul>
                                ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </td>
            </tr>
        </table>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateInfographic = (cv: TailoredCV) => {
    const styles = `
        h1 { font-size: 28pt; margin-bottom: 0; }
        h2 { font-size: 12pt; text-transform: uppercase; font-weight: bold; color: #111827; border-bottom: 2px solid #4f46e5; padding-bottom: 2px; margin-top: 20px; }
        .avatar-circle { width: 60px; height: 60px; background-color: #4f46e5; color: #fff; font-size: 24pt; text-align: center; line-height: 60px; border-radius: 50%; font-weight: bold; display: inline-block; vertical-align: middle; margin-right: 15px; }
        .sidebar-box { background-color: #f3f4f6; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .sidebar-h3 { font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; color: #111827; }
        .timeline-item { border-left: 2px solid #d1d5db; padding-left: 15px; margin-left: 5px; margin-bottom: 15px; }
    `;

    const body = `
        <table width="100%">
            <tr>
                <td style="vertical-align: middle;">
                    <div style="display: flex; align-items: center;">
                        <span class="avatar-circle">${cv.name.split(' ').map(n=>n[0]).join('').substring(0,2)}</span>
                        <div style="display: inline-block; vertical-align: middle;">
                            <h1>${escapeHtml(cv.name)}</h1>
                            <p style="font-size: 14pt; color: #4b5563; margin: 0;">${escapeHtml(cv.experience[0]?.jobTitle || 'Professional')}</p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <table width="100%" style="margin-top: 20px;">
            <tr>
                <!-- MAIN CONTENT (Left) -->
                <td width="66%" valign="top" style="padding-right: 20px;">
                    <h2>Summary</h2>
                    <p>${escapeHtml(cv.summary)}</p>

                    <h2>Experience</h2>
                    ${cv.experience.map(exp => `
                        <div class="timeline-item">
                            <table width="100%">
                                <tr>
                                    <td style="padding:0;"><h3 style="margin:0;">${escapeHtml(exp.jobTitle)}</h3></td>
                                    <td style="padding:0; text-align: right; font-size: 9pt; color: #6b7280; font-weight: bold;">${escapeHtml(exp.dates)}</td>
                                </tr>
                            </table>
                            <p style="font-style: italic; margin-bottom: 5px; font-size: 10pt;">${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</p>
                            <ul>
                                ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </td>
                
                <!-- SIDEBAR (Right) -->
                <td width="34%" valign="top">
                    <div class="sidebar-box">
                        <div class="sidebar-h3">Contact</div>
                        <p class="text-small">${escapeHtml(cv.contact.email)}</p>
                        ${cv.contact.phone ? `<p class="text-small">${escapeHtml(cv.contact.phone)}</p>` : ''}
                        ${cv.contact.linkedin ? `<p class="text-small">LinkedIn</p>` : ''}
                    </div>

                    <div class="sidebar-box">
                        <div class="sidebar-h3">Education</div>
                        ${cv.education.map(edu => `
                            <div style="margin-bottom: 10px;">
                                <p style="font-weight: bold; font-size: 10pt; margin-bottom: 0;">${escapeHtml(edu.degree)}</p>
                                <p class="text-small" style="margin-bottom: 0;">${escapeHtml(edu.institution)}</p>
                                <p class="text-small" style="color: #6b7280;">${escapeHtml(edu.dates)}</p>
                            </div>
                        `).join('')}
                    </div>

                    <div class="sidebar-box">
                        <div class="sidebar-h3">Skills</div>
                        ${cv.skills.map(s => `
                            <div style="margin-bottom: 5px;">
                                <span style="font-size: 10pt;">${escapeHtml(s)}</span>
                                <div style="width: 100%; height: 4px; background-color: #d1d5db; border-radius: 2px;"><div style="width: ${Math.floor(Math.random() * 30 + 70)}%; height: 4px; background-color: #4f46e5; border-radius: 2px;"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </td>
            </tr>
        </table>
    `;

    return createDocShell(cv.name, body, styles);
};

const generateBold = (cv: TailoredCV) => {
    const styles = `
        body { border-left: 10px solid #7c3aed; padding-left: 30px; }
        h1 { font-size: 36pt; font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; }
        h2 { font-size: 16pt; font-weight: 900; color: #7c3aed; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; }
        .contact-info { color: #4b5563; font-size: 11pt; }
        .job-meta { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
        .skill-badge { display: inline-block; background-color: #1f2937; color: #fff; padding: 4px 8px; font-weight: bold; font-size: 9pt; margin: 2px; border-radius: 4px; text-transform: uppercase; }
    `;

    const body = `
        <h1>${escapeHtml(cv.name)}</h1>
        <div class="contact-info">
            ${escapeHtml(cv.contact.email)}
            ${cv.contact.phone ? ` • ${escapeHtml(cv.contact.phone)}` : ''}
            ${cv.contact.linkedin ? ` • ${escapeHtml(cv.contact.linkedin)}` : ''}
        </div>

        <h2>Summary</h2>
        <p>${escapeHtml(cv.summary)}</p>

        <h2>Experience</h2>
        ${cv.experience.map(exp => `
            <div style="margin-bottom: 15px;">
                <table width="100%">
                    <tr>
                        <td style="padding:0;"><h3>${escapeHtml(exp.jobTitle)}</h3></td>
                        <td style="padding:0; text-align: right; font-weight: bold; color: #6b7280;">${escapeHtml(exp.dates)}</td>
                    </tr>
                </table>
                <div class="job-meta">${escapeHtml(exp.company)} / <span style="font-weight: normal; font-style: italic;">${escapeHtml(exp.location)}</span></div>
                <ul>
                    ${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>
        `).join('')}

        <table width="100%" style="margin-top: 20px;">
            <tr>
                <td width="50%" valign="top">
                    <h2>Education</h2>
                    ${cv.education.map(edu => `
                        <div style="margin-bottom: 10px;">
                            <h3 style="font-size: 12pt;">${escapeHtml(edu.degree)}</h3>
                            <p style="color: #4b5563;">${escapeHtml(edu.institution)} / ${escapeHtml(edu.dates)}</p>
                        </div>
                    `).join('')}
                </td>
                <td width="50%" valign="top">
                    <h2>Skills</h2>
                    <div>
                        ${cv.skills.map(s => `<span class="skill-badge">${escapeHtml(s)}</span>`).join(' ')}
                    </div>
                </td>
            </tr>
        </table>
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
