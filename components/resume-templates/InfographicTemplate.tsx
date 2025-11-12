
import React from 'react';
import type { TailoredCV } from '../../types';
import { MailIcon, PhoneIcon, LinkedInIcon } from '../Icons';

export const InfographicTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-8 bg-white text-gray-800 font-sans border border-gray-200 rounded-lg shadow-sm">
        <header className="flex items-center mb-8">
            <div className="w-24 h-24 bg-brand-primary text-white text-4xl font-bold flex items-center justify-center rounded-full mr-6">
                {cvData.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
                <h1 className="text-4xl font-bold text-gray-900">{cvData.name}</h1>
                <p className="text-xl text-gray-600">{cvData.experience[0]?.jobTitle || 'Professional'}</p>
            </div>
        </header>
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b-2 border-brand-primary pb-1 mb-3">Summary</h2>
                  <p className="text-sm leading-relaxed text-gray-700">{cvData.summary}</p>
                </section>
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b-2 border-brand-primary pb-1 mb-3">Experience</h2>
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="mb-4 relative pl-5">
                      <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white ring-2 ring-gray-300"></div>
                      <div className="border-l-2 border-gray-300 pl-6 pb-4 -ml-[9px]">
                          <p className="text-xs text-gray-500 font-medium float-right">{exp.dates}</p>
                          <h3 className="text-md font-bold text-gray-800">{exp.jobTitle}</h3>
                          <p className="text-sm text-gray-600 italic">{exp.company} - {exp.location}</p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                            {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                          </ul>
                      </div>
                    </div>
                  ))}
                </section>
                {cvData.publications && cvData.publications.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b-2 border-brand-primary pb-1 mb-3">Publications</h2>
                      {cvData.publications.map((pub, index) => (
                         <div key={index} className="mb-3 pl-5">
                            <h3 className="text-md font-bold text-gray-800">{pub.title}</h3>
                            <p className="text-sm text-gray-600 italic">{pub.journal} ({pub.date})</p>
                        </div>
                      ))}
                    </section>
                )}
            </div>
            <div className="col-span-1">
                <section className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-md font-bold text-gray-900 uppercase tracking-wider mb-3">Contact</h2>
                    <div className="text-sm space-y-2">
                        <div className="flex items-center"><MailIcon className="mr-2 text-brand-primary"/>{cvData.contact.email}</div>
                        {cvData.contact.phone && <div className="flex items-center"><PhoneIcon className="mr-2 text-brand-primary"/>{cvData.contact.phone}</div>}
                        {cvData.contact.linkedin && <div className="flex items-center"><LinkedInIcon className="mr-2 text-brand-primary"/>LinkedIn</div>}
                    </div>
                </section>
                <section className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-md font-bold text-gray-900 uppercase tracking-wider mb-3">Education</h2>
                    {cvData.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                            <h3 className="text-sm font-bold text-gray-800">{edu.degree}</h3>
                            <p className="text-xs text-gray-600">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.dates}</p>
                        </div>
                    ))}
                </section>
                <section className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-md font-bold text-gray-900 uppercase tracking-wider mb-3">Skills</h2>
                    <div className="space-y-2">
                    {cvData.skills.map((skill, index) => (
                      <div key={index}>
                        <p className="text-xs font-medium text-gray-700">{skill}</p>
                        <div className="w-full bg-gray-300 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full" style={{width: `${(Math.random() * (95 - 70) + 70).toFixed(0)}%`}}></div></div>
                      </div>
                    ))}
                  </div>
                </section>
            </div>
        </div>
    </div>
);
