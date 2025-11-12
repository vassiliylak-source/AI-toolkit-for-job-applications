
import React from 'react';
import type { TailoredCV } from '../../types';

export const CorporateTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="bg-white text-gray-800 font-sans border border-gray-200 rounded-lg shadow-sm">
        <header className="bg-gray-800 text-white p-8 rounded-t-lg">
            <h1 className="text-4xl font-bold tracking-normal">{cvData.name}</h1>
            <p className="text-lg text-gray-300 mt-1">Aspiring to be your next team member</p>
        </header>
        <main className="p-8">
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1">
                    <section>
                        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">Contact</h2>
                        <div className="text-sm space-y-1 text-gray-600">
                            <p>{cvData.contact.email}</p>
                            {cvData.contact.phone && <p>{cvData.contact.phone}</p>}
                            {cvData.contact.linkedin && <p><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn Profile</a></p>}
                        </div>
                    </section>
                    <hr className="my-6"/>
                    <section>
                        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">Education</h2>
                        {cvData.education.map((edu, index) => (
                            <div key={index} className="mb-3">
                                <h3 className="font-bold text-sm text-gray-800">{edu.degree}</h3>
                                <p className="text-xs text-gray-600">{edu.institution}</p>
                                <p className="text-xs text-gray-500">{edu.dates}</p>
                            </div>
                        ))}
                    </section>
                     {cvData.certifications && cvData.certifications.length > 0 && (
                        <>
                            <hr className="my-6"/>
                            <section>
                                <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">Certifications</h2>
                                {cvData.certifications.map((cert, index) => (
                                    <div key={index} className="mb-3">
                                        <h3 className="font-bold text-sm text-gray-800">{cert.name}</h3>
                                        <p className="text-xs text-gray-600">{cert.issuer}</p>
                                        <p className="text-xs text-gray-500">{cert.date}</p>
                                    </div>
                                ))}
                            </section>
                        </>
                    )}
                    <hr className="my-6"/>
                    <section>
                        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">Skills</h2>
                        <ul className="text-sm space-y-1 list-inside list-disc">
                            {cvData.skills.map((skill, index) => <li key={index}>{skill}</li>)}
                        </ul>
                    </section>
                </div>
                <div className="col-span-2">
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Professional Summary</h2>
                        <p className="text-sm leading-relaxed">{cvData.summary}</p>
                    </section>
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Work Experience</h2>
                        {cvData.experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-md font-bold text-gray-800">{exp.jobTitle}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                                </div>
                                <p className="text-sm text-gray-600 italic mb-2">{exp.company} - {exp.location}</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </main>
    </div>
);
