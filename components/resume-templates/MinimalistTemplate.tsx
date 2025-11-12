
import React from 'react';
import type { TailoredCV } from '../../types';

export const MinimalistTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-10 bg-white text-gray-700 font-sans border border-gray-200 rounded-lg shadow-sm">
        <header className="text-left mb-10">
          <h1 className="text-4xl font-light tracking-widest">{cvData.name}</h1>
          <div className="text-xs text-gray-500 mt-3 space-x-3">
            <span>{cvData.contact.email}</span>
            {cvData.contact.phone && <><span>/</span><span>{cvData.contact.phone}</span></>}
            {cvData.contact.linkedin && <><span>/</span><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">{cvData.contact.linkedin}</a></>}
          </div>
        </header>
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-gray-600">{cvData.summary}</p>
        </section>
        <hr className="border-gray-200 my-8"/>
        <section className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-500 mb-4">Experience</h2>
          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-medium text-gray-800">{exp.jobTitle} at {exp.company}</h3>
                <p className="text-xs text-gray-500">{exp.dates}</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">{exp.location}</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600 font-light">
                {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </section>
        {cvData.certifications && cvData.certifications.length > 0 && (
             <>
                <hr className="border-gray-200 my-8"/>
                <section className="mb-8">
                    <h2 className="text-sm font-medium tracking-widest uppercase text-gray-500 mb-4">Certifications</h2>
                    {cvData.certifications.map((cert, index) => (
                        <div key={index} className="mb-3">
                            <h3 className="text-md font-medium text-gray-800">{cert.name} {cert.date && <span className="text-xs text-gray-500 float-right">{cert.date}</span>}</h3>
                            {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
                        </div>
                    ))}
                </section>
            </>
        )}
        <hr className="border-gray-200 my-8"/>
        <div className="grid grid-cols-2 gap-8">
            <section>
              <h2 className="text-sm font-medium tracking-widest uppercase text-gray-500 mb-4">Education</h2>
              {cvData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h3 className="text-md font-medium text-gray-800">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.dates}</p>
                </div>
              ))}
            </section>
            <section>
              <h2 className="text-sm font-medium tracking-widest uppercase text-gray-500 mb-4">Skills</h2>
              <p className="text-sm font-light text-gray-600 leading-relaxed">{cvData.skills.join(', ')}</p>
            </section>
        </div>
    </div>
);
