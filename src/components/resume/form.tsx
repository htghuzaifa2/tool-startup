

"use client"

import { useFormContext, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, GripVertical, Briefcase, GraduationCap, Lightbulb, BookCopy } from 'lucide-react';
import { Label } from '../ui/label';
import { useState } from 'react';

export const resumeSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    photoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    summary: z.string().optional(),
    experience: z.array(z.object({
        id: z.string(),
        jobTitle: z.string().min(1, 'Job title is required'),
        company: z.string().min(1, 'Company is required'),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
        id: z.string(),
        degree: z.string().min(1, 'Degree is required'),
        institution: z.string().min(1, 'Institution is required'),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
    })).optional(),
    skills: z.string().optional(),
    projects: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, 'Project name is required'),
        description: z.string().optional(),
        url: z.string().optional(),
    })).optional(),
    publications: z.array(z.object({
        id: z.string(),
        title: z.string().min(1, 'Publication title is required'),
        journal: z.string().optional(),
        date: z.string().optional(),
        url: z.string().optional(),
    })).optional(),
});

export type ResumeData = z.infer<typeof resumeSchema>;

const Section = ({ onMoveUp, onMoveDown, canMoveUp, canMoveDown, title, icon, children }: { onMoveUp: () => void, onMoveDown: () => void, canMoveUp: boolean, canMoveDown: boolean, title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card className="relative group/section">
        <div className="absolute top-4 left-[-2.5rem] flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity hidden md:flex">
             <Button type="button" variant="ghost" size="icon" disabled={!canMoveUp} onClick={onMoveUp} className="h-6 w-6">
                <GripVertical className="h-4 w-4 rotate-90 scale-y-150 transform -rotate-90" />
            </Button>
            <Button type="button" variant="ghost" size="icon" disabled={!canMoveDown} onClick={onMoveDown} className="h-6 w-6">
                <GripVertical className="h-4 w-4 rotate-90 scale-y-150 transform rotate-90" />
            </Button>
        </div>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {children}
        </CardContent>
    </Card>
);

export function ResumeForm() {
    const { register, control, formState: { errors }, getValues, setValue } = useFormContext<ResumeData>();

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control, name: "experience" });
    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: "education" });
    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control, name: "projects" });
    const { fields: publicationFields, append: appendPublication, remove: removePublication } = useFieldArray({ control, name: "publications" });

    const [sectionOrder, setSectionOrder] = useState(['experience', 'projects', 'education', 'publications']);
    
    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...sectionOrder];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]; // Swap
        setSectionOrder(newOrder);
    };

    const sections: Record<string, React.ReactNode> = {
        experience: (
            <Section 
                key="experience"
                title="Work Experience" 
                icon={<Briefcase />} 
                onMoveUp={() => moveSection(sectionOrder.indexOf('experience'), 'up')}
                onMoveDown={() => moveSection(sectionOrder.indexOf('experience'), 'down')}
                canMoveUp={sectionOrder.indexOf('experience') > 0}
                canMoveDown={sectionOrder.indexOf('experience') < sectionOrder.length - 1}
            >
                {experienceFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <Input placeholder="Job Title" {...register(`experience.${index}.jobTitle`)} />
                        <Input placeholder="Company" {...register(`experience.${index}.company`)} />
                         <div className="flex gap-4">
                            <Input placeholder="Start Date (e.g., Jan 2020)" {...register(`experience.${index}.startDate`)} />
                            <Input placeholder="End Date (e.g., Present)" {...register(`experience.${index}.endDate`)} />
                        </div>
                        <Textarea placeholder="Description of your role and achievements. Use a new line for each point." {...register(`experience.${index}.description`)} className="min-h-[100px]" />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendExperience({ id: Date.now().toString(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}>
                    <PlusCircle className="mr-2" /> Add Experience
                </Button>
            </Section>
        ),
        projects: (
            <Section 
                key="projects"
                title="Projects" 
                icon={<Lightbulb />} 
                onMoveUp={() => moveSection(sectionOrder.indexOf('projects'), 'up')}
                onMoveDown={() => moveSection(sectionOrder.indexOf('projects'), 'down')}
                canMoveUp={sectionOrder.indexOf('projects') > 0}
                canMoveDown={sectionOrder.indexOf('projects') < sectionOrder.length - 1}
            >
                 {projectFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <Input placeholder="Project Name" {...register(`projects.${index}.name`)} />
                        <Input placeholder="Project URL (optional)" {...register(`projects.${index}.url`)} />
                        <Textarea placeholder="Brief project description..." {...register(`projects.${index}.description`)} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendProject({ id: Date.now().toString(), name: '', url: '', description: '' })}>
                    <PlusCircle className="mr-2" /> Add Project
                </Button>
            </Section>
        ),
        education: (
            <Section 
                key="education"
                title="Education" 
                icon={<GraduationCap />} 
                onMoveUp={() => moveSection(sectionOrder.indexOf('education'), 'up')}
                onMoveDown={() => moveSection(sectionOrder.indexOf('education'), 'down')}
                canMoveUp={sectionOrder.indexOf('education') > 0}
                canMoveDown={sectionOrder.indexOf('education') < sectionOrder.length - 1}
            >
                {educationFields.map((field, index) => (
                     <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <Input placeholder="Degree or Certificate" {...register(`education.${index}.degree`)} />
                        <Input placeholder="Institution Name" {...register(`education.${index}.institution`)} />
                        <div className="flex gap-4">
                            <Input placeholder="Start Date" {...register(`education.${index}.startDate`)} />
                            <Input placeholder="End Date" {...register(`education.${index}.endDate`)} />
                        </div>
                         <Textarea placeholder="Optional description (e.g., relevant coursework)" {...register(`education.${index}.description`)} />
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => appendEducation({ id: Date.now().toString(), degree: '', institution: '', startDate: '', endDate: '', description: '' })}>
                    <PlusCircle className="mr-2" /> Add Education
                </Button>
            </Section>
        ),
         publications: (
            <Section 
                key="publications"
                title="Publications" 
                icon={<BookCopy />} 
                onMoveUp={() => moveSection(sectionOrder.indexOf('publications'), 'up')}
                onMoveDown={() => moveSection(sectionOrder.indexOf('publications'), 'down')}
                canMoveUp={sectionOrder.indexOf('publications') > 0}
                canMoveDown={sectionOrder.indexOf('publications') < sectionOrder.length - 1}
            >
                 {publicationFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removePublication(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <Input placeholder="Publication Title" {...register(`publications.${index}.title`)} />
                        <Input placeholder="Journal or Conference Name" {...register(`publications.${index}.journal`)} />
                         <div className="flex gap-4">
                            <Input placeholder="Publication Date (e.g., 2023)" {...register(`publications.${index}.date`)} />
                            <Input placeholder="URL (optional)" {...register(`publications.${index}.url`)} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendPublication({ id: Date.now().toString(), title: '', journal: '', date: '', url: '' })}>
                    <PlusCircle className="mr-2" /> Add Publication
                </Button>
            </Section>
        ),
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="text-xl">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" {...register('fullName')} />
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <Label>Job Title</Label>
                        <Input placeholder="Software Engineer" {...register('jobTitle')} />
                        {errors.jobTitle && <p className="text-sm text-destructive">{errors.jobTitle.message}</p>}
                    </div>
                    <div>
                        <Label>Photo URL</Label>
                        <Input placeholder="https://..." {...register('photoUrl')} />
                         {errors.photoUrl && <p className="text-sm text-destructive">{errors.photoUrl.message}</p>}
                    </div>
                    <div>
                        <Label>Email Address</Label>
                        <Input placeholder="john.doe@example.com" {...register('email')} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                     <div>
                        <Label>Phone Number</Label>
                        <Input placeholder="123-456-7890" {...register('phone')} />
                    </div>
                     <div>
                        <Label>Address or Location</Label>
                        <Input placeholder="Anytown, USA" {...register('address')} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-xl">Professional Summary</CardTitle></CardHeader>
                <CardContent>
                    <Textarea placeholder="Write a brief summary about yourself..." {...register('summary')} className="min-h-[120px]" />
                </CardContent>
            </Card>

            <div className="space-y-6">
                {sectionOrder.map(sectionKey => sections[sectionKey])}
            </div>
            
            <Card>
                <CardHeader><CardTitle className="text-xl">Skills</CardTitle></CardHeader>
                <CardContent>
                    <Textarea placeholder="Enter your skills, separated by commas..." {...register('skills')} />
                </CardContent>
            </Card>
        </div>
    );
}
