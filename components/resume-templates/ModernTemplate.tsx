
import React from 'react';
import type { TailoredCV } from '../../types';

export const ModernTemplate: React.FC<{cvData: TailoredCV}> = ({cvData}) => (
    <div className="p-8 bg-white text-gray-800 font-sans border border-gray-200 rounded-lg shadow-sm">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider">{cvData.name}</h1>
          <div className="text-sm text-gray-600 mt-2 space-x-4">
            <span>{cvData.contact.email}</span>
            {cvData.contact.phone && <><span>&bull;</span><span>{cvData.contact.phone}</span></>}
            {cvData.contact.linkedin && <><span>&bull;</span><a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">{cvData.contact.linkedin}</a></>}
          </div>
        </header>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{cvData.summary}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Experience</h2>
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
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Education</h2>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                <p className="text-sm text-gray-600 font-medium">{edu.dates}</p>
              </div>
              <p className="text-sm text-gray-600 italic">{edu.institution} - {edu.location}</p>
            </div>
          ))}
        </section>
        {cvData.professionalDevelopment && cvData.professionalDevelopment.length > 0 && (
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Professional Development</h2>
                {cvData.professionalDevelopment.map((pd, index) => (
                    <div key={index} className="mb-2 text-sm">
                        <p className="font-bold text-gray-800">{pd.name}{pd.date && <span className="text-gray-600 font-medium float-right">{pd.date}</span>}</p>
                        {pd.institution && <p className="text-gray-600 italic">{pd.institution}</p>}
                    </div>
                ))}
            </section>
        )}
        {cvData.certifications && cvData.certifications.length > 0 && (
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Certifications</h2>
                {cvData.certifications.map((cert, index) => (
                    <div key={index} className="mb-2 text-sm">
                        <p className="font-bold text-gray-800">{cert.name}{cert.date && <span className="text-gray-600 font-medium float-right">{cert.date}</span>}</p>
                        {cert.issuer && <p className="text-gray-600 italic">{cert.issuer}</p>}
                    </div>
                ))}
            </section>
        )}
        {cvData.publications && cvData.publications.length > 0 && (
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Publications</h2>
                {cvData.publications.map((pub, index) => (
                    <div key={index} className="mb-2 text-sm">
                        <p className="font-bold text-gray-800">{pub.title}{pub.date && <span className="text-gray-600 font-medium float-right">{pub.date}</span>}</p>
                        {pub.journal && <p className="text-gray-600 italic">{pub.journal}</p>}
                    </div>
                ))}
            </section>
        )}
        {cvData.awards && cvData.awards.length > 0 && (
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Awards</h2>
                {cvData.awards.map((award, index) => (
                    <div key={index} className="mb-2 text-sm">
                        <p className="font-bold text-gray-800">{award.name}{award.date && <span className="text-gray-600 font-medium float-right">{award.date}</span>}</p>
                        {award.issuer && <p className="text-gray-600 italic">{award.issuer}</p>}
                    </div>
                ))}
            </section>
        )}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-brand-primary pb-2 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </section>
    </div>
);
