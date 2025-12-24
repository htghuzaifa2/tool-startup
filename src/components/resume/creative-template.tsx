
"use client"

import { Mail, Phone, MapPin, Link as LinkIcon, Star } from 'lucide-react';
import type { ResumeData } from './form';
import { useState, useEffect } from 'react';

interface TemplateProps {
    data: ResumeData;
    accentColor: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    showPhoto: boolean;
}

const SkillBar = ({ skill, level }: { skill: string; level: number }) => (
    <div>
        <p className="text-xs font-semibold mb-1">{skill}</p>
        <div className="w-full bg-primary-foreground/20 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-primary-foreground" style={{ width: `${level}%` }}></div>
        </div>
    </div>
);

export function CreativeTemplate({ data, accentColor, showEmail, showPhone, showAddress, showPhoto }: TemplateProps) {
    const [skillLevels, setSkillLevels] = useState<number[]>([]);
    const skills = data.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

    useEffect(() => {
        // Generate random levels only on the client, after hydration.
        setSkillLevels(
            skills.map(() => Math.floor(Math.random() * 50) + 50)
        );
    }, [data.skills, skills.length]);
    
    const renderDescription = (text?: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            return <li key={index} className="text-muted-foreground/90 leading-snug">{line.replace(/^-/, '').trim()}</li>
        });
    };

    return (
        <div className="flex w-full h-full bg-card text-card-foreground">
            {/* Left Sidebar */}
            <div style={{ backgroundColor: accentColor }} className="w-1/3 p-6 text-white flex flex-col">
                {showPhoto && data.photoUrl && (
                    <div className="flex justify-center mb-6">
                        <img 
                            src={data.photoUrl} 
                            alt={data.fullName || 'Profile'} 
                            className="rounded-full w-32 h-32 object-cover border-4 border-white/50 shadow-lg"
                        />
                    </div>
                )}
                
                <div className="text-center mb-8">
                     <h1 className="text-3xl font-bold tracking-tight">{data.fullName || 'Your Name'}</h1>
                     <h2 className="text-base font-light tracking-wide mt-1">{data.jobTitle || 'Your Job Title'}</h2>
                </div>

                <div className="space-y-6">
                    <div>
                         <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-3">Contact</h3>
                         <div className="space-y-2 text-xs">
                             {showEmail && data.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0"/><span>{data.email}</span></p>}
                             {showPhone && data.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0"/><span>{data.phone}</span></p>}
                             {showAddress && data.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0"/><span>{data.address}</span></p>}
                         </div>
                    </div>
                    {skills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-3">Skills</h3>
                            <div className="space-y-2 text-xs">
                               {skills.map((skill, i) => (
                                   <SkillBar key={i} skill={skill} level={skillLevels[i] || 0} />
                               ))}
                            </div>
                        </div>
                    )}
                     <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-3">Education</h3>
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
                {data.summary && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Profile</h3>
                        <p className="text-muted-foreground/90 text-sm leading-relaxed">{data.summary}</p>
                    </div>
                )}

                {data.experience && data.experience.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Experience</h3>
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
                
                {data.projects && data.projects.length > 0 && (
                     <div className="mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Projects</h3>
                        <div className="space-y-4">
                            {data.projects?.map((proj) => (
                                <div key={proj.id}>
                                    <div className="flex items-center gap-2">
                                         <h4 className="text-base font-bold">{proj.name}</h4>
                                         {proj.url && <a href={proj.url} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline"><LinkIcon className="w-3 h-3" /></a>}
                                    </div>
                                    <p className="text-muted-foreground/90 text-sm leading-relaxed mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
