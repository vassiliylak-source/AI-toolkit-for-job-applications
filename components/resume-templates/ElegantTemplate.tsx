
import React from 'react';
import type { TailoredCV } from '../../types';

export const ElegantTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-8 bg-white text-gray-700 font-serif border border-gray-200 rounded-lg shadow-sm">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wide" style={{fontFamily: "'Garamond', serif"}}>{cvData.name}</h1>
            <div className="text-xs text-gray-500 mt-2 space-x-3 tracking-widest">
                <span>{cvData.contact.email}</span>
                {cvData.contact.phone && <><span>&bull;</span><span>{cvData.contact.phone}</span></>}
                {cvData.contact.linkedin && <><span>&bull;</span><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">{cvData.contact.linkedin}</a></>}
            </div>
        </header>
        <div className="w-24 h-px bg-gray-300 mx-auto my-8"></div>
        <section className="mb-6 text-center max-w-2xl mx-auto">
          <p className="text-sm leading-loose italic">{cvData.summary}</p>
        </section>
        <div className="w-24 h-px bg-gray-300 mx-auto my-8"></div>
        <section className="mb-6">
          <h2 className="text-xl font-bold text-center tracking-widest text-gray-700 mb-6">EXPERIENCE</h2>
          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-5 grid grid-cols-4 gap-4">
                <div className="col-span-1 text-right">
                    <p className="text-sm font-semibold text-gray-600">{exp.dates}</p>
                    <p className="text-xs text-gray-500">{exp.location}</p>
                </div>
                <div className="col-span-3 border-l-2 border-gray-200 pl-4">
                  <h3 className="text-lg font-bold text-gray-800">{exp.jobTitle}</h3>
                  <p className="text-sm text-gray-600 italic mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                    {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                  </ul>
                </div>
            </div>
          ))}
        </section>
        {cvData.awards && cvData.awards.length > 0 && (
            <section className="mb-6">
                <h2 className="text-xl font-bold text-center tracking-widest text-gray-700 mb-6">AWARDS & HONORS</h2>
                {cvData.awards.map((award, index) => (
                    <div key={index} className="mb-3 text-center">
                        <h3 className="text-md font-bold text-gray-800">{award.name}</h3>
                        <p className="text-sm text-gray-600">{award.issuer} {award.date && `(${award.date})`}</p>
                    </div>
                ))}
            </section>
        )}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-center tracking-widest text-gray-700 mb-6">EDUCATION & SKILLS</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              {cvData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h3 className="text-md font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.dates}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-gray-700">{cvData.skills.join(' • ')}</p>
            </div>
          </div>
        </section>
    </div>
);
