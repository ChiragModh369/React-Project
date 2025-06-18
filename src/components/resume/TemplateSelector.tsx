import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { ResumeTemplate } from '@/types/resumeTypes';
import { useToast } from '@/hooks/use-toast';
import { isUserLoggedIn } from '@/commonFunctions/Functions';

interface TemplateSelectorProps {
  templates: ResumeTemplate[];
  selectedTemplate: string;
  onSelect: (template: ResumeTemplate) => void;
}

const TemplateSelector = ({
  templates,
  selectedTemplate,
  onSelect
}: TemplateSelectorProps) => {
  const { toast } = useToast();

  const handleTemplateClick = (template: ResumeTemplate) => {
    if (!isUserLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to select a CV template.",
        variant: "destructive",
      });
      return;
    }
    onSelect(template);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all hover:border-cyber-blue/40",
            selectedTemplate?.id === template.id && "border-cyber-blue bg-cyber-blue/5"
          )}
          onClick={() => handleTemplateClick(template)}
        >
          <CardContent className="p-4">
            <div className="relative h-[420px] mb-4 rounded-md overflow-hidden flex items-center justify-center bg-white">
              <img
                src={template.preview_image}
                alt={template.template_name}
                className="h-full w-auto object-contain"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-cyber-blue/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-1">{template.template_name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;