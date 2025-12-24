"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

// Declare puter as a global variable
declare const puter: {
    ai: {
        chat: (prompt: string) => Promise<{ message: { content: string } }>;
    };
};

type Message = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
};

export default function ChatBotPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your AI assistant. How can I help you today?",
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (typeof puter === 'undefined') {
                throw new Error("AI service is not available. Please refresh the page.");
            }

            // Construct conversation history for context (last 10 messages)
            // Puter's simple chat API might only take a string, but we can format the prompt
            // to include history if needed. For this v1, we'll send the latest prompt
            // or a concatenated history if we want context.
            // Let's try sending the last few messages as context.
            
            const conversationHistory = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
            const prompt = `You are a helpful AI assistant.
            
Previous conversation:
${conversationHistory}

User: ${userMessage.content}

Assistant:`;

            const response = await puter.ai.chat(prompt);

            if (response && response.message && response.message.content) {
                const botMessage: Message = {
                    role: 'assistant',
                    content: response.message.content,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error("Empty response from AI.");
            }

        } catch (error: unknown) {
            console.error("Chat error:", error);
            toast({
                title: "Error",
                description: "Failed to get a response from the AI. Please try again.",
                variant: "destructive"
            });
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again later.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-4">
                <Card className="flex-1 flex flex-col shadow-lg border-primary/20">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>ChatBot AI</CardTitle>
                                <CardDescription>Smart Conversational Assistant powered by AI</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden relative">
                        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                            <div className="space-y-4 pb-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <Avatar className="w-8 h-8 mt-1">
                                                <AvatarFallback className="bg-primary/10 text-primary"><Bot size={16} /></AvatarFallback>
                                                <AvatarImage src="/bot-avatar.png" />
                                            </Avatar>
                                        )}
                                        <div
                                            className={`rounded-lg p-3 max-w-[80%] text-sm ${
                                                message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground ml-auto'
                                                    : 'bg-muted border'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                        </div>
                                        {message.role === 'user' && (
                                            <Avatar className="w-8 h-8 mt-1">
                                                <AvatarFallback className="bg-accent/10 text-accent"><User size={16} /></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <Avatar className="w-8 h-8 mt-1">
                                            <AvatarFallback className="bg-primary/10 text-primary"><Bot size={16} /></AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted border rounded-lg p-3 flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t bg-background">
                        <div className="flex w-full gap-2">
                            <Input
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="flex-1"
                                autoFocus
                            />
                            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
