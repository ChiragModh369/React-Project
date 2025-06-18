
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard';
import { Link } from 'react-router-dom';
import { fetchCyberSecurityJobs, refreshJobsCache } from '@/services/jobsService';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobsSection = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Fetch jobs using React Query
  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['cyberSecurityJobs', 'homepage'],
    queryFn: () => fetchCyberSecurityJobs(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Display error toast if there's an error
  React.useEffect(() => {
    if (error) {
      console.error('Error in jobs query:', error);
      toast({
        title: "Error loading jobs",
        description: "We're having trouble loading the latest job listings. Using sample data instead.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Log the number of jobs for debugging
  React.useEffect(() => {
    if (jobs) {
      console.log(`Homepage jobs fetched: ${jobs.length}`);
    }
  }, [jobs]);

  // Only display the first 3 jobs on the homepage
  const featuredJobs = jobs?.slice(0, 3);
  
  // Handle manually refreshing the jobs cache
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshJobsCache();
      await refetch();
      toast({
        title: "Jobs refreshed",
        description: "Latest job listings have been updated",
      });
    } catch (err) {
      toast({
        title: "Error refreshing jobs",
        description: "We couldn't refresh the job listings. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="py-16 relative">
      <div 
        className="absolute inset-0 bg-cyber-dark-blue opacity-20 -skew-y-3 transform"
        aria-hidden="true"
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Cybersecurity <span className="text-cyber-blue">Jobs</span></h2>
            <p className="text-muted-foreground">Launch your career with top positions from leading companies</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isLoading || isRefreshing}
              title="Refresh job listings"
              className="relative"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button asChild variant="outline" className="cyber-border">
              <Link to="/jobs">
                Browse All Jobs
              </Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-cyber-blue animate-spin" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load live jobs at this time. Showing sample listings instead.</p>
          </div>
        ) : featuredJobs && featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cybersecurity jobs available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsSection;
