
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

export function ModernTemplate({ data, accentColor, showEmail, showPhone, showAddress }: TemplateProps) {
    const renderDescription = (text?: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            return <li key={index} className="text-muted-foreground/90 leading-snug">{line.replace(/^-/, '').trim()}</li>
        });
    };

    return (
        <div className="flex w-full h-full">
            {/* Left Sidebar */}
            <div style={{ backgroundColor: accentColor }} className="w-1/3 p-6 text-white flex flex-col">
                <div className="text-center mb-8">
                     <h1 className="text-4xl font-bold tracking-tight">{data.fullName || 'Your Name'}</h1>
                     <h2 className="text-lg font-light tracking-wide mt-1">{data.jobTitle || 'Your Job Title'}</h2>
                </div>

                <div className="space-y-5">
                    <div>
                         <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-2">Contact</h3>
                         <div className="space-y-2 text-xs">
                             {showEmail && data.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0"/><span>{data.email}</span></p>}
                             {showPhone && data.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0"/><span>{data.phone}</span></p>}
                             {showAddress && data.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0"/><span>{data.address}</span></p>}
                         </div>
                    </div>
                     <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                           {(data.skills || '').split(',').map((skill, i) => (
                               <span key={i} className="bg-white/20 rounded-md px-2 py-0.5">{skill.trim()}</span>
                           ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-2">Education</h3>
                         <div className="space-y-3">
                            {data.education?.map((edu) => (
                                <div key={edu.id}>
                                    <h4 className="text-sm font-bold">{edu.degree}</h4>
                                    <p className="text-xs font-light">{edu.institution}</p>
                                    <p className="text-xs font-light text-white/70">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="w-2/3 p-8">
                {/* Summary */}
                {data.summary && (
                    <div className="mb-6">
                        <h3 style={{ color: accentColor }} className="text-lg font-bold uppercase tracking-widest mb-2">Summary</h3>
                        <p className="text-muted-foreground/90 text-sm leading-relaxed">{data.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div className="mb-6">
                        <h3 style={{ color: accentColor }} className="text-lg font-bold uppercase tracking-widest mb-3">Experience</h3>
                        <div className="space-y-4">
                            {data.experience?.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="text-base font-bold">{exp.jobTitle}</h4>
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
                    <div>
                        <h3 style={{ color: accentColor }} className="text-lg font-bold uppercase tracking-widest mb-3">Projects</h3>
                        <div className="space-y-4">
                            {data.projects?.map((proj) => (
                                <div key={proj.id}>
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                         <h4 className="text-base font-bold">{proj.name}</h4>
                                         {proj.url && <a href={proj.url} target="_blank" rel="noreferrer noopener" className="text-xs text-muted-foreground hover:underline">({proj.url})</a>}
                                    </div>
                                    <p className="text-sm text-muted-foreground/90 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
