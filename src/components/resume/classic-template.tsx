
"use client"

import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import type { ResumeData } from './form';

interface TemplateProps {
    data: ResumeData;
    accentColor: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
}

export function ClassicTemplate({ data, accentColor, showEmail, showPhone, showAddress }: TemplateProps) {
    const renderDescription = (text?: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            return <li key={index} className="text-foreground/80 leading-snug">{line.replace(/^-/, '').trim()}</li>
        });
    };

    return (
        <div className="w-full h-full font-serif">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold tracking-wider">{data.fullName || 'Your Name'}</h1>
                <p className="text-lg font-medium text-muted-foreground mt-2">{data.jobTitle || 'Your Job Title'}</p>
                 <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-muted-foreground/90">
                    {showEmail && data.email && <span className="flex items-center gap-2">{data.email}</span>}
                    {showPhone && data.phone && <><span>|</span><span className="flex items-center gap-2">{data.phone}</span></>}
                    {showAddress && data.address && <><span>|</span><span className="flex items-center gap-2">{data.address}</span></>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-6">
                    <p className="text-foreground/80 text-center leading-relaxed">{data.summary}</p>
                </div>
            )}

            <hr className="my-6" />

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 style={{ color: accentColor }} className="text-xl font-bold uppercase tracking-widest text-center mb-4">Experience</h2>
                    <div className="space-y-5">
                        {data.experience?.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-bold text-foreground">{exp.jobTitle}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-base font-semibold text-foreground/80">{exp.company}</p>
                                <ul className="list-disc list-outside mt-2 pl-5 space-y-1 text-sm">
                                    {renderDescription(exp.description)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 style={{ color: accentColor }} className="text-xl font-bold uppercase tracking-widest text-center mb-4">Projects</h2>
                    <div className="space-y-4">
                        {data.projects?.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex items-center gap-2">
                                     <h3 className="text-base font-bold text-foreground">{proj.name}</h3>
                                     {proj.url && <a href={proj.url} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline"><LinkIcon className="w-4 h-4" style={{color: accentColor}} /></a>}
                                </div>
                                <p className="text-foreground/80 text-sm leading-relaxed mt-1">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Education */}
             {data.education && data.education.length > 0 && (
                <div className="mb-6">
                    <h2 style={{ color: accentColor }} className="text-xl font-bold uppercase tracking-widest text-center mb-4">Education</h2>
                    <div className="space-y-4">
                        {data.education?.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-bold text-foreground">{edu.degree}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className="text-base font-semibold text-foreground/80">{edu.institution}</p>
                                {edu.description && <p className="text-foreground/80 text-sm italic mt-1">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills && (
                <div>
                    <h2 style={{ color: accentColor }} className="text-xl font-bold uppercase tracking-widest text-center mb-3">Skills</h2>
                    <p className="text-foreground/80 text-center text-sm leading-relaxed">{data.skills}</p>
                </div>
            )}
        </div>
    );
}
