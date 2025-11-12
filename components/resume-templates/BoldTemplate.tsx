
import React from 'react';
import type { TailoredCV } from '../../types';

export const BoldTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-8 bg-white text-gray-800 font-sans border-2 border-gray-900 rounded-lg shadow-sm relative">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-brand-secondary"></div>
        <header className="mb-8">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{cvData.name}</h1>
            <div className="text-md text-gray-600 mt-2 space-x-3">
                <span>{cvData.contact.email}</span>
                {cvData.contact.phone && <><span>&bull;</span><span>{cvData.contact.phone}</span></>}
                {cvData.contact.linkedin && <><span>&bull;</span><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">{cvData.contact.linkedin}</a></>}
            </div>
        </header>
        <section className="mb-6">
            <h2 className="text-2xl font-extrabold text-brand-secondary tracking-wide mb-3">SUMMARY</h2>
            <p className="text-sm leading-relaxed text-gray-700">{cvData.summary}</p>
        </section>
        <section className="mb-6">
            <h2 className="text-2xl font-extrabold text-brand-secondary tracking-wide mb-3">EXPERIENCE</h2>
            {cvData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-bold text-gray-800">{exp.jobTitle}</h3>
                        <p className="text-sm text-gray-600 font-medium">{exp.dates}</p>
                    </div>
                    <p className="text-sm text-gray-600 font-bold">{exp.company} / <span className="font-normal italic">{exp.location}</span></p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                        {exp.responsibilities.map((resp, i) => <li key={i}><span className="font-semibold">{resp.split(':')[0]}</span>{resp.includes(':') ? resp.substring(resp.indexOf(':')) : ''}</li>)}
                    </ul>
                </div>
            ))}
        </section>
        {cvData.professionalDevelopment && cvData.professionalDevelopment.length > 0 && (
            <section className="mb-6">
                <h2 className="text-2xl font-extrabold text-brand-secondary tracking-wide mb-3">PROFESSIONAL DEVELOPMENT</h2>
                {cvData.professionalDevelopment.map((pd, index) => (
                    <div key={index} className="mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{pd.name}</h3>
                        <p className="text-sm text-gray-600">{pd.institution} / {pd.date}</p>
                    </div>
                ))}
            </section>
        )}
        <div className="grid grid-cols-2 gap-8">
            <section className="mb-6">
                <h2 className="text-2xl font-extrabold text-brand-secondary tracking-wide mb-3">EDUCATION</h2>
                {cvData.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">{edu.institution} / {edu.dates}</p>
                    </div>
                ))}
            </section>
            <section>
                <h2 className="text-2xl font-extrabold text-brand-secondary tracking-wide mb-3">SKILLS</h2>
                <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-800 text-white text-xs font-bold uppercase px-3 py-1 rounded">{skill}</span>
                    ))}
                </div>
            </section>
        </div>
    </div>
);
