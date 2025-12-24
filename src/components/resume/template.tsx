
"use client"

import { useFormContext } from 'react-hook-form';
import type { ResumeData } from './form';
import type { FontFamily } from '@/app/resume-builder/page';
import { ProfessionalTemplate } from './professional-template';
import { ModernTemplate } from './modern-template';
import { MinimalistTemplate } from './minimalist-template';
import { ClassicTemplate } from './classic-template';
import { CreativeTemplate } from './creative-template';
import { TechnicalTemplate } from './technical-template';
import { CorporateTemplate } from './corporate-template';
import { AcademicTemplate } from './academic-template';
import { InfographicTemplate } from './infographic-template';

export type TemplateName = "professional" | "modern" | "minimalist" | "classic" | "creative" | "technical" | "corporate" | "academic" | "infographic";

interface ResumeTemplateProps {
    template: TemplateName;
    accentColor: string;
    fontSize: number;
    fontFamily: FontFamily;
    lineHeight: number;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    showPhoto: boolean;
    id?: string;
}

export function ResumeTemplate({ template, id, ...customization }: ResumeTemplateProps) {
    const { watch } = useFormContext<ResumeData>();
    const data = watch();

    const fontClasses: Record<FontFamily, string> = {
        sans: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono',
    }

    const commonProps = { data, ...customization };

    const renderTemplate = () => {
        switch (template) {
            case 'modern':
                return <ModernTemplate {...commonProps} />;
            case 'minimalist':
                return <MinimalistTemplate {...commonProps} />;
            case 'classic':
                return <ClassicTemplate {...commonProps} />;
            case 'creative':
                return <CreativeTemplate {...commonProps} />;
            case 'technical':
                return <TechnicalTemplate {...commonProps} />;
            case 'corporate':
                return <CorporateTemplate {...commonProps} />;
            case 'academic':
                return <AcademicTemplate {...commonProps} />;
            case 'infographic':
                return <InfographicTemplate {...commonProps} />;
            case 'professional':
            default:
                return <ProfessionalTemplate {...commonProps} />;
        }
    }

    // A simple function to reorder the main sections based on form state
    const getOrderedSections = () => {
        const order = ['experience', 'projects', 'education']; // This could be dynamic from state in a more advanced version
        const sections: { [key: string]: boolean } = {
            experience: !!(data.experience && data.experience.length > 0 && data.experience.some(e => e.jobTitle)),
            projects: !!(data.projects && data.projects.length > 0 && data.projects.some(p => p.name)),
            education: !!(data.education && data.education.length > 0 && data.education.some(e => e.degree))
        };
        
        // In this simple version, we are not reordering but this structure allows for it.
        // The reordering logic is handled in the form itself.
        // A more advanced implementation would pass the sectionOrder from the form to here.
        return (
             <div
                id={id}
                className='h-full w-full'
             >
                {renderTemplate()}
            </div>
        )
    }

    return (
        <div 
            className={`w-[816px] h-[1056px] bg-background text-foreground p-10 ${fontClasses[customization.fontFamily]}`}
            style={{ 
                fontSize: `${customization.fontSize}pt`,
                lineHeight: customization.lineHeight,
                color: 'hsl(var(--foreground))',
                backgroundColor: 'hsl(var(--background))'
            }}
        >
            {getOrderedSections()}
        </div>
    );
}

