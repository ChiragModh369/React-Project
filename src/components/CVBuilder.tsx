
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, FileText, Download, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const CVBuilder = () => {
  return (
    <section className="py-16 bg-cyber-dark-blue/20 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="mb-6 p-4 rounded-full bg-cyber-blue/10 border border-cyber-blue/30">
            <FileText className="h-10 w-10 text-cyber-blue" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Create Your <span className="bg-gradient-to-r from-cyber-blue to-cyber-green bg-clip-text text-transparent">Cybersecurity CV</span> With AI
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Our AI-powered CV builder helps you create professional, ATS-friendly resumes tailored for cybersecurity roles.
            Get noticed by top employers with industry-specific keywords and formatting.
          </p>
          
          <Card className="w-full max-w-3xl backdrop-blur-sm bg-black/30 border-cyber-blue/30">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-cyber-blue/10 p-4 rounded-md border border-cyber-blue/30 flex items-start">
                    <Shield className="h-5 w-5 text-cyber-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-cyber-blue mb-1">Industry-Specific Templates</h3>
                      <p className="text-sm text-muted-foreground">Designed specifically for cybersecurity roles and compliance with ATS systems</p>
                    </div>
                  </div>
                  
                  <div className="bg-cyber-blue/10 p-4 rounded-md border border-cyber-blue/30 flex items-start">
                    <Shield className="h-5 w-5 text-cyber-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-cyber-blue mb-1">Skill Analysis</h3>
                      <p className="text-sm text-muted-foreground">AI identifies your strongest cybersecurity skills and recommends improvements based on industry standards</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-cyber-blue/10 p-4 rounded-md border border-cyber-blue/30 flex items-start">
                    <Target className="h-5 w-5 text-cyber-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-cyber-blue mb-1">Job Description Targeting</h3>
                      <p className="text-sm text-muted-foreground">Optimize your CV for specific job listings by pasting the description for tailored content</p>
                    </div>
                  </div>
                  
                  <div className="bg-cyber-blue/10 p-4 rounded-md border border-cyber-blue/30 flex items-start">
                    <Download className="h-5 w-5 text-cyber-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-cyber-blue mb-1">Microsoft Word Export</h3>
                      <p className="text-sm text-muted-foreground">Download your professional CV as a Word document for easy editing and sharing</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" className="bg-cyber-blue hover:bg-cyber-blue/80 text-black px-8 py-6">
                  <Link to="/cv-builder">
                    Build Your CV Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CVBuilder;
