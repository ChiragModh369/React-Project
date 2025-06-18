import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'; // Import react-select
import { fetchReadJobsAction } from '@/redux/actions/mainAction';
import { showLog } from '@/commonFunctions/Functions';
import { CLEAR_READ_JOBS } from '@/redux/actions/types/reduxConst';
import { useToast } from '@/components/ui/use-toast';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { JobProps } from '@/types/jobTypes';

interface JobTargetingProps {
  selectedJob: JobProps | null;
  onJobSelect: (job: JobProps | null, url?: string) => void; // Updated to include URL
}

const JobTargeting = ({ selectedJob, onJobSelect }: JobTargetingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state
  const {
    isJobsLoading,
    jobStatusCode,
    jobMessage,
    jobMainData,
  } = useSelector((state: any) => state.readJobReducer);

  // Clear API state
  const clearAPI = () => {
    dispatch({ type: CLEAR_READ_JOBS });
  };

  // Handle API status
  useApiStatusHandler({
    statusCode: jobStatusCode,
    message: jobMessage,
    mainData: jobMainData,
    clearAPI,
    onSuccess: (mainData) => {
      showLog('Jobs fetched for targeting', mainData.length);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs. Please try again.',
        variant: 'destructive',
      });
    },
    toast,
  });

  // Fetch jobs with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const data: { search?: string } = {};
      if (searchQuery.trim() !== '') data.search = searchQuery;
      showLog('Fetching jobs for targeting', data);
      dispatch(fetchReadJobsAction(data));
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch]);

  // Format jobs for react-select
  const jobOptions = jobMainData?.map((job: JobProps) => ({
    value: job.id,
    label: `${job.job_title} at ${job.company_name} (${job.location})`,
    job, // Store full job object for selection
  })) || [];

  // Handle job selection
  const handleJobChange = (selectedOption: any) => {
    const selectedJob = selectedOption ? selectedOption.job : null;
    const url = selectedJob?.url; // Extract URL from selected job
    onJobSelect(selectedJob, url); // Pass both job and URL
  };

  return (
    <div className="space-y-4 relative z-0">
      <Select
        options={jobOptions}
        value={jobOptions.find((option) => option.value === selectedJob?.id) || null}
        onChange={handleJobChange}
        onInputChange={(inputValue) => setSearchQuery(inputValue)}
        placeholder="Search and select a job to target..."
        isClearable
        isSearchable
        isLoading={isJobsLoading} // Show loading state in the dropdown
        noOptionsMessage={() =>
          searchQuery ? 'No jobs found' : 'Start typing to search jobs'
        }
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: '#1A202C', // Dark background to match UI
            borderColor: '#4A5568', // Border color to match UI
            borderRadius: '0.375rem', // Rounded corners
            minHeight: '38px',
            color: '#E2E8F0', // Text color
            boxShadow: 'none', // Remove default shadow
            '&:hover': {
              borderColor: '#A0AEC0', // Lighter border on hover
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1A202C', // Solid dark background
            border: '1px solid #4A5568',
            borderRadius: '0.375rem',
            zIndex: 1000, // High z-index to appear above buttons
            marginTop: '4px',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#38B2AC' // Cyan/green highlight for selected (matches UI)
              : state.isFocused
              ? '#2D3748' // Darker shade for hover
              : '#1A202C',
            color: state.isSelected ? '#FFFFFF' : '#E2E8F0',
            '&:active': {
              backgroundColor: '#38B2AC',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: '#E2E8F0',
          }),
          input: (base) => ({
            ...base,
            color: '#E2E8F0',
          }),
          placeholder: (base) => ({
            ...base,
            color: '#A0AEC0',
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: '#E2E8F0',
            '&:hover': {
              color: '#A0AEC0',
            },
          }),
          loadingIndicator: (base) => ({
            ...base,
            color: '#E2E8F0', // Customize loading indicator color
          }),
          loadingMessage: (base) => ({
            ...base,
            color: '#E2E8F0',
          }),
        }}
      />

      {!isJobsLoading && jobMainData && jobMainData.length === 0 && searchQuery && (
        <p className="text-center text-muted-foreground py-4">
          No jobs found matching your search criteria
        </p>
      )}
    </div>
  );
};

export default JobTargeting;