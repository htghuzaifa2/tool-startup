
"use client"

import { Mail, Phone, MapPin, Link as LinkIcon, BookOpen } from 'lucide-react';
import type { ResumeData } from './form';

interface TemplateProps {
    data: ResumeData;
    accentColor: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
}

export function AcademicTemplate({ data, accentColor, showEmail, showPhone, showAddress }: TemplateProps) {
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
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold">{data.fullName || 'Your Name'}</h1>
                <p className="text-lg text-muted-foreground mt-1">{data.jobTitle || 'Your Academic Title'}</p>
                 <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground/90">
                    {showEmail && data.email && <span className="flex items-center gap-2">{data.email}</span>}
                    {showPhone && data.phone && <><span>&middot;</span><span className="flex items-center gap-2">{data.phone}</span></>}
                    {showAddress && data.address && <><span>&middot;</span><span className="flex items-center gap-2">{data.address}</span></>}
                </div>
            </div>
            
            {data.summary && (
                <div className="mb-5">
                    <h2 className="font-bold text-base tracking-wider uppercase mb-2" style={{ color: accentColor }}>Research Statement</h2>
                    <p className="text-foreground/80 text-sm leading-relaxed">{data.summary}</p>
                </div>
            )}
            
             {data.education && data.education.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-base tracking-wider uppercase mb-2" style={{ color: accentColor }}>Education</h2>
                    <div className="space-y-3">
                        {data.education?.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold text-foreground">{edu.degree}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className="text-sm font-semibold text-foreground/80">{edu.institution}</p>
                                {edu.description && <p className="text-foreground/80 text-xs italic mt-1">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-base tracking-wider uppercase mb-2" style={{ color: accentColor }}>Appointments</h2>
                    <div className="space-y-4">
                        {data.experience?.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold text-foreground">{exp.jobTitle}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-sm font-semibold text-foreground/80">{exp.company}</p>
                                <ul className="list-disc list-outside mt-1 pl-4 space-y-0.5 text-sm">
                                    {renderDescription(exp.description)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Publications */}
            {data.publications && data.publications.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-base tracking-wider uppercase mb-2" style={{ color: accentColor }}>Publications</h2>
                    <ul className="space-y-2 list-outside list-decimal pl-4">
                        {data.publications?.map((pub) => (
                            <li key={pub.id} className="text-sm">
                                 <span className="font-bold">{pub.title}.</span>
                                 {pub.journal && <span className="italic text-foreground/80"> {pub.journal}.</span>}
                                 {pub.date && <span className="text-muted-foreground"> ({pub.date}).</span>}
                                 {pub.url && <a href={pub.url} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline ml-1"><LinkIcon className="w-3 h-3 inline-block" style={{color: accentColor}} /></a>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Skills */}
            {data.skills && (
                <div>
                    <h2 className="font-bold text-base tracking-wider uppercase mb-2" style={{ color: accentColor }}>Skills</h2>
                    <p className="text-foreground/80 text-sm leading-relaxed">{data.skills}</p>
                </div>
            )}
        </div>
    );
}

