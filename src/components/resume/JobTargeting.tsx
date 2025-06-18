import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, CheckSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCyberSecurityJobs } from '@/services/jobsService';

interface JobTargetingProps {
  selectedJob: any;
  onJobSelect: (job: any) => void;
}

const JobTargeting = ({ selectedJob, onJobSelect }: JobTargetingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', searchQuery],
    queryFn: () => fetchCyberSecurityJobs(searchQuery),
    enabled: searchQuery.length > 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically trigger due to the useQuery hook
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search for jobs to target your resume..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto" />
        </div>
      )}

      {jobs && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className={`cursor-pointer transition-all hover:border-cyber-blue/40 ${
                selectedJob?.id === job.id ? 'border-cyber-blue bg-cyber-blue/5' : ''
              }`}
              onClick={() => onJobSelect(job)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="secondary">
                          +{job.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  {selectedJob?.id === job.id && (
                    <CheckSquare className="h-5 w-5 text-cyber-blue flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {jobs && jobs.length === 0 && searchQuery && (
        <p className="text-center text-muted-foreground py-4">
          No jobs found matching your search criteria
        </p>
      )}
    </div>
  );
};

export default JobTargeting;