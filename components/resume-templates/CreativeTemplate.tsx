
import React from 'react';
import type { TailoredCV } from '../../types';

export const CreativeTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-0 bg-white text-gray-800 font-sans border border-gray-200 rounded-lg shadow-sm flex">
        <aside className="w-1/3 bg-gray-800 text-white p-6 rounded-l-lg">
            <h1 className="text-3xl font-bold tracking-wider leading-tight text-white mb-6">{cvData.name}</h1>
            <section className="mb-6">
                <h2 className="text-lg font-semibold text-brand-primary uppercase tracking-wider mb-2">Contact</h2>
                <div className="text-sm space-y-1">
                    <p>{cvData.contact.email}</p>
                    {cvData.contact.phone && <p>{cvData.contact.phone}</p>}
                    {cvData.contact.linkedin && <p><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></p>}
                </div>
            </section>
            <section className="mb-6">
                <h2 className="text-lg font-semibold text-brand-primary uppercase tracking-wider mb-2">Education</h2>
                {cvData.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                        <h3 className="font-bold text-sm text-white">{edu.degree}</h3>
                        <p className="text-xs text-gray-300">{edu.institution}</p>
                        <p className="text-xs text-gray-400">{edu.dates}</p>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-lg font-semibold text-brand-primary uppercase tracking-wider mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                        <span key={index} className="bg-brand-primary text-white text-xs font-medium px-2 py-1 rounded">{skill}</span>
                    ))}
                </div>
            </section>
        </aside>
        <main className="w-2/3 p-8">
            <section className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Summary</h2>
                <p className="text-sm leading-relaxed">{cvData.summary}</p>
            </section>
            <section className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Experience</h2>
                {cvData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold text-gray-800">{exp.jobTitle}</h3>
                            <p className="text-sm text-gray-600 font-medium">{exp.dates}</p>
                        </div>
                        <p className="text-sm text-gray-600 italic">{exp.company} - {exp.location}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                            {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
            {cvData.professionalDevelopment && cvData.professionalDevelopment.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Professional Development</h2>
                    {cvData.professionalDevelopment.map((pd, index) => (
                        <div key={index} className="mb-3">
                            <h3 className="text-md font-bold text-gray-800">{pd.name} {pd.date && <span className="text-sm text-gray-600 font-medium float-right">{pd.date}</span>}</h3>
                            {pd.institution && <p className="text-sm text-gray-600 italic">{pd.institution}</p>}
                        </div>
                    ))}
                </section>
            )}
            {cvData.publications && cvData.publications.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Publications</h2>
                     {cvData.publications.map((pub, index) => (
                        <div key={index} className="mb-3">
                            <h3 className="text-md font-bold text-gray-800">{pub.title} {pub.date && <span className="text-sm text-gray-600 font-medium float-right">{pub.date}</span>}</h3>
                            {pub.journal && <p className="text-sm text-gray-600 italic">{pub.journal}</p>}
                        </div>
                    ))}
                </section>
            )}
        </main>
    </div>
);
