
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { fetchCyberSecurityJobs, fetchSecurityArchitectureJobs, refreshJobsCache } from '@/services/jobsService';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { clearAllJobsCache } from '@/utils/cacheUtils';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLog } from '@/commonFunctions/Functions';
import { CLEAR_READ_JOBS } from '@/redux/actions/types/reduxConst';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { fetchReadJobsAction } from '@/redux/actions/mainAction';
import { Loader } from '@/components/ui/loader';
import { RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyObject, JobProps } from '@/types/jobTypes';
import CompanyDetailsModal from '@/components/ui/CompanyDetailsModal';

const COUNTRIES = [
  'All Countries',
  'United Kingdom',
  'United States',
  'Canada',
  // 'Australia',
  // 'Germany',
  // 'France',
  // 'Netherlands',
  // 'Singapore',
  // 'Ireland',
  // 'Switzerland',
];

const Jobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedCompany, setSelectedCompany] = useState<CompanyObject | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const jobsPerPage = 9;
  
  /* API for getting jobs - Start */
  
  const clearAPI = () => {
    dispatch({ type: CLEAR_READ_JOBS });
  }
  const callJobsAPI = (country: string = 'All Countries',search: string = '') => {
    const data: { country?: string; search?: string } = {};
    if (country !== 'All Countries') {
      data.country = country;
    }
    if (search.trim() !== '') data.search = search;
    showLog("callJobsAPI", data)
    dispatch(fetchReadJobsAction(data));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      callJobsAPI(selectedCountry, searchQuery);
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [selectedCountry, searchQuery]);

  const {
    isJobsLoading,
    jobStatusCode,
    jobMessage,
    jobMainData,
  } = useSelector(data => data.readJobReducer);

  useApiStatusHandler({
    statusCode: jobStatusCode,
    message: jobMessage,
    mainData: jobMainData,
    clearAPI: clearAPI,
    onSuccess: mainData => {
      showLog("JOB main data", jobMainData.length);
    },
    toast,
    navigate,
  });
  /* API for getting jobs - End */

// Filter jobs based on search query and country
  // const filteredJobs = React.useMemo(() => {
  //   if (!jobs) return [];
    
  //   let filtered = jobs;
    
  //   // Filter by search query
  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(job => 
  //       job.job_title.toLowerCase().includes(query) ||
  //       job.company_name.toLowerCase().includes(query) ||
  //       job.description.toLowerCase().includes(query) ||
  //       job.technologies.some(skill => skill.toLowerCase().includes(query))
  //     );
  //   }
    
  //   // Filter by country
  //   if (selectedCountry !== 'all') {
  //     filtered = filtered.filter(job => {
        
  //       const jobCountryCode = job?.country_code;
  //       return jobCountryCode === selectedCountry;
  //     });
  //   }
    
  //   return filtered;
  // }, [jobs, searchQuery, selectedCountry]);


  // Fetch jobs based on the active filter
  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['cyberSecurityJobs', activeFilter],
    queryFn: () => activeFilter === 'security-architecture'
      ? fetchSecurityArchitectureJobs()
      : fetchCyberSecurityJobs(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Calculate pagination
  const totalJobs = jobMainData?.length || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobMainData?.slice(indexOfFirstJob, indexOfLastJob) || [];

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Pagination handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setCurrentPage(1);
  };

  // Filter handler
  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  // Handle company click
  const handleCompanyClick = (job: JobProps) => {
    if (job.companyDetails) {
      setSelectedCompany(job.companyDetails);
      setShowCompanyModal(true);
    }
  };

  // Handle refreshing jobs data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      clearAllJobsCache();
      dispatch({ type: CLEAR_READ_JOBS });

      // ✅ Reset filter fields
      setSearchQuery('');
      setSelectedCountry('All Countries');

      // ✅ Call API with no filters
      const data = { query: '' };
      dispatch(fetchReadJobsAction(data));

      toast({
        title: 'Jobs refreshed',
        description: 'All filters cleared and job listings refreshed.',
      });
    } catch (err) {
      console.error("Error refreshing jobs:", err);
      toast({
        title: "Error refreshing jobs",
        description: "We couldn't refresh the job listings. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle clearing all cache
  const handleClearCache = () => {
    clearAllJobsCache();
    toast({
      title: "Cache cleared",
      description: "All cached job data has been cleared. Refreshing data...",
    });
    refetch();
  };
  

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-cyber-dark-blue py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cybersecurity Jobs</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mb-6">
              Discover top positions at leading companies in the cybersecurity industry.
              These jobs are sourced directly from TheirStack API.
            </p>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/10 border-cyber-blue/30"
                />
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <Select value={activeFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[200px] bg-background/10 border-cyber-blue/30">
                      <SelectValue placeholder="Job Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cybersecurity Jobs</SelectItem>
                      <SelectItem value="security-architecture">Security Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Country:</span>
                  <Select value={selectedCountry} onValueChange={handleCountryChange}>
                    <SelectTrigger className="w-[180px] bg-background/10 border-cyber-blue/30">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1"></div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRefresh} 
                    disabled={isLoading || isRefreshing}
                    title="Refresh job listings"
                  >
                    <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearCache}
                    className="text-xs"
                    title="Clear cached job data"
                  >
                    Clear cache
                  </Button>
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    {totalJobs} jobs found
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Jobs List */}
        <div className="container mx-auto px-4 py-12">
          {isJobsLoading ? (

            <Loader />
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-lg text-destructive">
                Error loading jobs. Please try again later.
              </p>
            </div>
          ) : jobs && totalJobs > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentJobs.map((job) => (
                  <JobCard key={job.id} job={job} onCompanyClick={handleCompanyClick} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {pageNumbers.map((number) => (
                        <PaginationItem key={number}>
                          <PaginationLink
                            isActive={currentPage === number}
                            onClick={() => handlePageChange(number)}
                            className="cursor-pointer"
                          >
                            {number}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No jobs found. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Company Details Modal */}
      <CompanyDetailsModal
        open={showCompanyModal}
        onOpenChange={setShowCompanyModal}
        company={selectedCompany}
      />

      <Footer />
    </div>
  );
};

export default Jobs;
