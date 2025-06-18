import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Clock, MapPin, ExternalLink, Info } from 'lucide-react';
import { JobProps } from '@/types/jobTypes';
import { showLog } from '@/commonFunctions/Functions';

interface JobCardProps {
  job: JobProps;
  onCompanyClick?: (job: JobProps) => void;
}

const JobCard = ({ job, onCompanyClick }: JobCardProps) => {
  // Fallback application URL that searches for the job on CV Library
  const getApplyUrl = () => {
    if (job.url) {
      return job.url;
    }
    // Create a fallback URL that searches for the job on CV Library
    const searchQuery = encodeURIComponent(`${job.job_title} ${job.company_name}`);
    return `https://www.cv-library.co.uk/search-jobs?q=${searchQuery}`;
  };

  const handleApply = () => {
    // Open the job application URL in a new tab
    window.open(getApplyUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleCompanyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCompanyClick && job.companyDetails) {
      onCompanyClick(job);
      showLog('Company details clicked:', job.companyDetails);
    }
  };

  return (
    <Card className="hover:border-cyber-blue/40 transition-all cyber-border">
      <CardHeader className="pb-2 flex flex-row items-start space-x-4">
        <div className="w-12 h-12 rounded bg-card overflow-hidden flex items-center justify-center">
          <img
            src={job.logo || "https://placehold.co/100x100?text=Company"}
            alt={`${job.company_name} logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/100x100?text=Company";
            }}
          />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold leading-tight hover:text-cyber-blue transition-colors">
            {job.job_title}
          </h3>
          <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center mr-4">
              <Building className="w-3 h-3 mr-1" />
              <span className="hover:text-cyber-blue cursor-pointer" onClick={handleCompanyClick}>{job.company_name}</span>
              {job.companyDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-1"
                  onClick={handleCompanyClick}
                  title="View company details"
                >
                  <Info className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        {/* <Badge
          variant={
            job.employment_type === 'Remote' ? 'outline' :
              job.employment_type === 'Full Time' ? 'default' :
                job.employment_type === 'Contract' ? 'secondary' :
                  'destructive'
          }
          className={job.employment_type === 'Remote' ? 'border-cyber-green text-cyber-green' : ''}
        >
          {job.employment_type}
        </Badge> */}
        <Badge
          variant={

            'default'

          }
        // className={job.employment_type === 'Remote' ? 'border-cyber-green text-cyber-green' : ''}
        >
          {job.employment_type}
        </Badge>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {job?.technologies?.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-background/40">{skill}</Badge>
          ))}
          {job?.technologies?.length > 3 && (
            <Badge variant="outline" className="bg-background/40">+{job.technologies.length - 3} more</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-2 border-t border-border">
        <div className="flex items-center text-sm">
          <span className="font-medium">{job.salary}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{job.date_posted_label}</span>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
          onClick={handleApply}
        >
          Apply <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
