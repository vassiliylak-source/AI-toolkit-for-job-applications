
import React from 'react';
import type { TailoredCV } from '../../types';

export const TechTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-0 bg-white text-gray-800 font-sans border border-gray-200 rounded-lg shadow-sm flex text-sm">
        <aside className="w-1/3 bg-gray-900 text-gray-300 p-6 rounded-l-lg font-mono">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">{cvData.name}</h1>
            <p className="text-cyan-400 mb-8">&gt; {cvData.experience[0]?.jobTitle || 'Professional'}</p>
            <section className="mb-6">
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider mb-2">// CONTACT</h2>
                <div className="text-xs space-y-1">
                    <p><span className="text-green-400">'email'</span>: <span className="text-orange-400">"{cvData.contact.email}"</span></p>
                    {cvData.contact.phone && <p><span className="text-green-400">'phone'</span>: <span className="text-orange-400">"{cvData.contact.phone}"</span></p>}
                    {cvData.contact.linkedin && <p><span className="text-green-400">'linkedin'</span>: <span className="text-orange-400">"<a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">link</a>"</span></p>}
                </div>
            </section>
            <section className="mb-6">
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider mb-2">// EDUCATION</h2>
                {cvData.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                        <h3 className="font-bold text-sm text-gray-100">{edu.degree}</h3>
                        <p className="text-xs text-gray-400">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.dates}</p>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider mb-2">// SKILLS</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                    {cvData.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-700 text-cyan-400 px-2 py-1 rounded">{skill}</span>
                    ))}
                </div>
            </section>
        </aside>
        <main className="w-2/3 p-8 font-sans">
            <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">README.md</h2>
                <p className="text-sm leading-relaxed text-gray-600">{cvData.summary}</p>
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Commit History (Experience)</h2>
                {cvData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-bold text-gray-800">{exp.jobTitle}</h3>
                            <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                        </div>
                        <p className="text-sm text-gray-600 italic">{exp.company} - {exp.location}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                            {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
            {cvData.certifications && cvData.certifications.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Deployments (Certifications)</h2>
                     {cvData.certifications.map((cert, index) => (
                        <div key={index} className="mb-3">
                           <h3 className="text-md font-bold text-gray-800">{cert.name}</h3>
                           <p className="text-sm text-gray-600 italic">{cert.issuer} ({cert.date})</p>
                        </div>
                    ))}
                </section>
            )}
        </main>
    </div>
);
