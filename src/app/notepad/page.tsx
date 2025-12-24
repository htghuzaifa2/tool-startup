
"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Save, Download, Trash2, FileText, Edit, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { guides } from "@/lib/search-data";
import { FancyAccordionButton } from '@/components/ui/fancy-accordion-button';


const LOCAL_STORAGE_KEY = 'huzi-pk-notepad-notes';

type Note = {
  id: number;
  content: string;
  date: string;
};

export default function NotepadPage() {
    const [currentNote, setCurrentNote] = useState('');
    const [savedNotes, setSavedNotes] = useState<Note[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const { toast } = useToast();
    const notepadGuide = guides.find(g => g.href.includes('notepad'));

    const handleGuideClick = () => {
        // The content is not immediately available, so we wait for the next render tick.
        requestAnimationFrame(() => {
            const guideElement = document.getElementById('guide-section');
            if (guideElement) {
                const yOffset = -80; // a little space from the top
                const y = guideElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    };

    useEffect(() => {
        try {
            const savedNotesJson = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedNotesJson) {
                setSavedNotes(JSON.parse(savedNotesJson));
            } else {
                 setCurrentNote("Welcome to your local notepad! Start typing here. Your notes will be saved in your browser's local storage.");
            }
        } catch (error) {
            console.error("Could not read notes from local storage", error);
        }
    }, []);

    const handleSaveOrUpdateNote = useCallback(() => {
        if (!currentNote.trim()) {
            toast({
                title: "Empty Note",
                description: "Cannot save an empty note.",
                variant: "destructive",
            });
            return;
        }

        try {
            if (editingNoteId) {
                // Update existing note
                const updatedNotes = savedNotes.map(note => 
                    note.id === editingNoteId 
                    ? { ...note, content: currentNote, date: new Date().toLocaleString() } 
                    : note
                );
                setSavedNotes(updatedNotes);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
                toast({
                    title: "Note Updated!",
                    description: "Your note has been successfully updated.",
                });
            } else {
                // Save new note
                const newNote: Note = {
                    id: Date.now(),
                    content: currentNote,
                    date: new Date().toLocaleString(),
                };
                const updatedNotes = [newNote, ...savedNotes];
                setSavedNotes(updatedNotes);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
                toast({
                    title: "Note Saved!",
                    description: "Your new note has been successfully saved.",
                });
            }
            clearEditor();
        } catch (error) {
            console.error("Could not save to local storage", error);
            toast({
                title: "Error Saving",
                description: "Could not save the note. Your browser might be in private mode or storage is full.",
                variant: "destructive",
            });
        }
    }, [currentNote, savedNotes, toast, editingNoteId]);

    const handleEditNote = (note: Note) => {
        setCurrentNote(note.content);
        setEditingNoteId(note.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const clearEditor = () => {
        setCurrentNote('');
        setEditingNoteId(null);
    }
    
    const handleDeleteNote = (id: number) => {
        try {
            const updatedNotes = savedNotes.filter(note => note.id !== id);
            setSavedNotes(updatedNotes);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
            toast({
                title: "Note Deleted",
                description: "The note has been removed.",
            });
             if (editingNoteId === id) {
                clearEditor();
            }
        } catch (error) {
            console.error("Could not delete from local storage", error);
        }
    }
    
    const handleDownloadNote = (content: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `note-${timestamp}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-4xl font-bold font-headline">{editingNoteId ? 'Edit Note' : 'Digital Notepad'}</CardTitle>
                        <CardDescription>Your private space to write, edit, save, and download notes. All data is stored locally.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <Textarea
                            placeholder="Start writing your new note here..."
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            className="min-h-[200px] text-base font-mono bg-muted/50"
                        />
                        <div className="flex justify-center gap-4 flex-wrap">
                           <Button onClick={handleSaveOrUpdateNote} size="lg">
                               {editingNoteId ? <><Edit className="mr-2" /> Update Note</> : <><Save className="mr-2" /> Save New Note</>}
                           </Button>
                           {(currentNote || editingNoteId) && (
                                <Button onClick={clearEditor} size="lg" variant="outline">
                                    <X className="mr-2" /> {editingNoteId ? 'Cancel Editing' : 'Clear Editor'}
                                </Button>
                           )}
                        </div>
                    </CardContent>
                </Card>
                
                {savedNotes.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-center mb-6 font-headline">Saved Notes</h2>
                        <div className="grid gap-6">
                            {savedNotes.map((note) => (
                                <Card key={note.id} className={`break-words ${editingNoteId === note.id ? 'border-primary ring-2 ring-primary' : ''}`}>
                                    <CardContent className="p-6">
                                        <p className="text-muted-foreground whitespace-pre-wrap font-mono">{note.content}</p>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">Saved: {note.date}</p>
                                        <div className="flex gap-2">
                                             <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDownloadNote(note.content)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your note.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {notepadGuide && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="guide" id="guide-section" className="border-none flex flex-col items-center">
                            <AccordionTrigger onClick={handleGuideClick} className="w-full justify-center">
                                <FancyAccordionButton />
                            </AccordionTrigger>
                            <AccordionContent className="pt-6 w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{notepadGuide.title}</CardTitle>
                                        <CardDescription>{notepadGuide.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                            {notepadGuide.steps.map((step, stepIndex) => (
                                                <li key={stepIndex}>{step}</li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>
        </div>
    );
}
