
import React from 'react';
import type { TailoredCV } from '../../types';

export const ClassicTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-8 bg-white text-gray-900 font-serif border border-gray-200 rounded-lg shadow-sm">
        <header className="text-center mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold tracking-widest uppercase">{cvData.name}</h1>
          <div className="text-xs mt-2">
            <span>{cvData.contact.email}</span>
            {cvData.contact.phone && <><span> | </span><span>{cvData.contact.phone}</span></>}
            {cvData.contact.linkedin && <><span> | </span><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">{cvData.contact.linkedin}</a></>}
          </div>
        </header>
        <section className="mb-5">
          <h2 className="text-lg font-bold tracking-wider uppercase border-b border-gray-300 pb-1 mb-2">Summary</h2>
          <p className="text-sm leading-normal">{cvData.summary}</p>
        </section>
        <section className="mb-5">
          <h2 className="text-lg font-bold tracking-wider uppercase border-b border-gray-300 pb-1 mb-2">Experience</h2>
          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="text-md font-bold">{exp.jobTitle}</h3>
                <p className="text-sm">{exp.dates}</p>
              </div>
              <p className="text-sm italic">{exp.company}, {exp.location}</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm pl-2">
                {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </section>
        <section className="mb-5">
          <h2 className="text-lg font-bold tracking-wider uppercase border-b border-gray-300 pb-1 mb-2">Education</h2>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-2">
               <div className="flex justify-between">
                <h3 className="text-md font-bold">{edu.degree}</h3>
                <p className="text-sm">{edu.dates}</p>
              </div>
              <p className="text-sm italic">{edu.institution}, {edu.location}</p>
            </div>
          ))}
        </section>
        {cvData.professionalDevelopment && cvData.professionalDevelopment.length > 0 && (
            <section className="mb-5">
                <h2 className="text-lg font-bold tracking-wider uppercase border-b border-gray-300 pb-1 mb-2">Professional Development</h2>
                {cvData.professionalDevelopment.map((pd, index) => (
                     <div key={index} className="mb-2">
                        <div className="flex justify-between">
                            <h3 className="text-md font-bold">{pd.name}</h3>
                            <p className="text-sm">{pd.date}</p>
                        </div>
                        {pd.institution && <p className="text-sm italic">{pd.institution}</p>}
                    </div>
                ))}
            </section>
        )}
        {cvData.certifications && cvData.certifications.length > 0 && (
            <section className="mb-5">
                <h2 className="text-lg font-bold tracking-wider uppercase border-b border-gray-300 pb-1 mb-2">Certifications</h2>
                 {cvData.certifications.map((cert, index) => (
                     <div key={index} className="mb-2">
                        <div className="flex justify-between">
                            <h3 className="text-md font-bold">{cert.name}</h3>
                            <p className="text-sm">{cert.date}</p>
                        </div>
                        {cert.issuer && <p className="text-sm italic">{cert.issuer}</p>}
                    </div>
                ))}
            </section>
        )}
        <section>
          <h2 className="text-lg font-bold tracking-wider uppercase border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="text-sm">{cvData.skills.join(' | ')}</p>
        </section>
    </div>
);
