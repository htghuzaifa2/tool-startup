
"use client"

import { Mail, Phone, MapPin, Link as LinkIcon, Code } from 'lucide-react';
import type { ResumeData } from './form';

interface TemplateProps {
    data: ResumeData;
    accentColor: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
}

export function TechnicalTemplate({ data, accentColor, showEmail, showPhone, showAddress }: TemplateProps) {
    const renderDescription = (text?: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            return <li key={index} className="text-foreground/80 leading-snug">{line.trim()}</li>
        });
    };

    return (
        <div className="w-full h-full font-mono bg-background text-foreground">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b-2" style={{borderColor: accentColor}}>
                <div>
                    <h1 className="text-4xl font-bold">{data.fullName || 'Your Name'}</h1>
                    <p className="text-lg font-medium" style={{color: accentColor}}>{data.jobTitle || 'Your Job Title'}</p>
                </div>
                <div className="text-right space-y-1 text-sm text-muted-foreground">
                    {showEmail && data.email && <p>{data.email}</p>}
                    {showPhone && data.phone && <p>{data.phone}</p>}
                    {showAddress && data.address && <p>{data.address}</p>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mt-5 mb-5">
                    <p className="text-foreground/90 text-sm leading-relaxed">{data.summary}</p>
                </div>
            )}

            {/* Skills */}
            {data.skills && (
                <div className="mb-5">
                    <h2 className="text-base font-bold uppercase tracking-wider pb-1 border-b" style={{borderColor: accentColor, color: accentColor}}>Skills</h2>
                    <p className="text-foreground/80 text-sm leading-relaxed mt-2">{data.skills}</p>
                </div>
            )}
            
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-base font-bold uppercase tracking-wider pb-1 border-b" style={{borderColor: accentColor, color: accentColor}}>Experience</h2>
                    <div className="space-y-4 mt-2">
                        {data.experience?.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold text-foreground">{exp.jobTitle} @ {exp.company}</h3>
                                    <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <ul className="list-disc list-outside mt-1 pl-5 space-y-1 text-sm">
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
                    <h2 className="text-base font-bold uppercase tracking-wider pb-1 border-b" style={{borderColor: accentColor, color: accentColor}}>Projects</h2>
                    <div className="space-y-4 mt-2">
                        {data.projects?.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold text-foreground">{proj.name}</h3>
                                    {proj.url && <a href={proj.url} target="_blank" rel="noreferrer noopener" className="text-xs text-muted-foreground hover:underline">{proj.url}</a>}
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed mt-1">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Education */}
             {data.education && data.education.length > 0 && (
                <div>
                    <h2 className="text-base font-bold uppercase tracking-wider pb-1 border-b" style={{borderColor: accentColor, color: accentColor}}>Education</h2>
                    <div className="space-y-3 mt-2">
                        {data.education?.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">{edu.degree}</h3>
                                        <p className="text-sm text-foreground/80">{edu.institution}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
