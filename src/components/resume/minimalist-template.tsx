
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

export function MinimalistTemplate({ data, accentColor, showEmail, showPhone, showAddress }: TemplateProps) {
    const renderDescription = (text?: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            return <li key={index} className="text-muted-foreground/90 leading-snug">{line.replace(/^-/, '').trim()}</li>
        });
    };

    return (
        <div style={{ borderColor: accentColor }} className="border-t-4">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold tracking-tight">{data.fullName || 'Your Name'}</h1>
                <h2 className="text-lg font-medium text-muted-foreground tracking-wider uppercase mt-1">{data.jobTitle || 'Your Job Title'}</h2>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                    {showEmail && data.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{data.email}</span>}
                    {showPhone && data.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{data.phone}</span>}
                    {showAddress && data.address && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{data.address}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-5">
                    <p className="text-muted-foreground/90 text-center italic text-sm">{data.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-5">
                    <h3 style={{ color: accentColor }} className="text-base font-bold uppercase tracking-widest text-center mb-3">Experience</h3>
                    <div className="space-y-4">
                        {data.experience?.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-sm font-bold">{exp.jobTitle}</h4>
                                    <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-sm font-semibold text-muted-foreground/80">{exp.company}</p>
                                <ul className="list-disc list-outside mt-1.5 pl-4 space-y-1">
                                    {renderDescription(exp.description)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-5">
                    <h3 style={{ color: accentColor }} className="text-base font-bold uppercase tracking-widest text-center mb-3">Projects</h3>
                    <div className="space-y-4">
                        {data.projects?.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex items-center gap-2 mb-0.5">
                                     <h4 className="text-sm font-bold">{proj.name}</h4>
                                     {proj.url && <a href={proj.url} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline"><LinkIcon className="w-3 h-3" /></a>}
                                </div>
                                <p className="text-xs text-muted-foreground/90 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <div className="mb-5">
                    <h3 style={{ color: accentColor }} className="text-base font-bold uppercase tracking-widest text-center mb-3">Education</h3>
                    <div className="space-y-3">
                        {data.education?.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-sm font-bold">{edu.degree}</h4>
                                    <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className="text-sm font-semibold text-muted-foreground/80">{edu.institution}</p>
                                {edu.description && <p className="text-xs text-muted-foreground/90 italic mt-1">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills && (
                <div>
                    <h3 style={{ color: accentColor }} className="text-base font-bold uppercase tracking-widest text-center mb-2">Skills</h3>
                    <p className="text-muted-foreground/90 text-center text-sm leading-relaxed">{data.skills}</p>
                </div>
            )}
        </div>
    );
}
