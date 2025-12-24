
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

export function CorporateTemplate({ data, accentColor, showEmail, showPhone, showAddress }: TemplateProps) {
    const renderDescription = (text?: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            return <li key={index} className="text-muted-foreground/90 leading-snug">{line.replace(/^-/, '').trim()}</li>
        });
    };
    
    return (
        <div className="w-full h-full font-sans">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-4xl font-bold">{data.fullName || 'Your Name'}</h1>
                    <h2 className="text-lg font-medium" style={{ color: accentColor }}>{data.jobTitle || 'Your Job Title'}</h2>
                </div>
                <div className="text-right text-xs space-y-1 text-muted-foreground">
                    {showEmail && data.email && <div className="flex items-center justify-end gap-2"><p>{data.email}</p><Mail className="w-3.5 h-3.5" style={{ color: accentColor }}/></div>}
                    {showPhone && data.phone && <div className="flex items-center justify-end gap-2"><p>{data.phone}</p><Phone className="w-3.5 h-3.5" style={{ color: accentColor }}/></div>}
                    {showAddress && data.address && <div className="flex items-center justify-end gap-2"><p>{data.address}</p><MapPin className="w-3.5 h-3.5" style={{ color: accentColor }}/></div>}
                </div>
            </div>

            {/* Summary */}
            <div className="mt-5 mb-5">
                <p className="text-sm leading-relaxed text-foreground/80">{data.summary}</p>
            </div>

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white px-2 py-1 mb-2" style={{ backgroundColor: accentColor }}>Experience</h3>
                    <div className="space-y-4">
                        {data.experience?.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-base font-bold text-foreground">{exp.jobTitle}</h4>
                                    <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                                <ul className="list-disc list-outside mt-1.5 pl-4 space-y-1 text-sm">
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
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white px-2 py-1 mb-2" style={{ backgroundColor: accentColor }}>Projects</h3>
                    <div className="space-y-4">
                        {data.projects?.map((proj) => (
                             <div key={proj.id}>
                                <div className="flex items-center gap-2 mb-0.5">
                                     <h4 className="text-base font-bold text-foreground">{proj.name}</h4>
                                     {proj.url && <a href={proj.url} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline"><LinkIcon className="w-3 h-3" /></a>}
                                </div>
                                <p className="text-sm text-muted-foreground/90 leading-relaxed mt-1">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
             {data.education && data.education.length > 0 && (
                <div className="mb-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white px-2 py-1 mb-2" style={{ backgroundColor: accentColor }}>Education</h3>
                    <div className="space-y-3">
                        {data.education?.map((edu) => (
                             <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-base font-bold">{edu.degree}</h4>
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
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white px-2 py-1 mb-2" style={{ backgroundColor: accentColor }}>Skills</h3>
                    <p className="text-sm leading-relaxed text-foreground/80">{data.skills}</p>
                </div>
            )}
        </div>
    );
}


