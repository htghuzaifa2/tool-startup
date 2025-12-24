import { Metadata } from 'next';
import { tools } from '@/lib/search-data';
import { ToolGuide } from '@/components/tool-guide';

interface ToolPageLayoutProps {
  children: React.ReactNode;
  toolHref: string;
}

export function ToolPageLayout({ children, toolHref }: ToolPageLayoutProps) {
  const tool = tools.find(t => t.href === toolHref);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const guideSteps = tool.guide || [];

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {children}
        
        <ToolGuide title={tool.title} steps={guideSteps} />
      </div>
    </div>
  );
}

export function generateToolMetadata(toolHref: string): Metadata {
  const tool = tools.find(t => t.href === toolHref);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `https://tool.huzi.pk${tool.href}`,
    },
    twitter: {
      title: tool.title,
      description: tool.description,
    },
  };
}
