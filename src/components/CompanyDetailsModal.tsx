import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Users, Calendar, DollarSign, ExternalLink, Globe, Linkedin } from 'lucide-react';

interface CompanyObject {
  name: string;
  domain?: string;
  industry?: string;
  country?: string;
  country_code?: string;
  employee_count?: number;
  logo?: string;
  url?: string;
  linkedin_url?: string;
  founded_year?: number;
  annual_revenue_usd_readable?: string;
  employee_count_range?: string;
  long_description?: string;
  city?: string;
  num_jobs?: number;
  num_jobs_last_30_days?: number;
}

interface CompanyDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyObject | null;
}

const CompanyDetailsModal = ({ open, onOpenChange, company }: CompanyDetailsModalProps) => {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-card overflow-hidden flex items-center justify-center">
              <img 
                src={company.logo || "https://placehold.co/100x100?text=Company"} 
                alt={`${company.name} logo`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/100x100?text=Company";
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{company.name}</h2>
              {company.industry && (
                <Badge variant="secondary" className="mt-1">
                  {company.industry}
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {company.city}{company.country && `, ${company.country}`}
                </span>
              </div>
            )}
            
            {company.employee_count && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {company.employee_count_range || `${company.employee_count} employees`}
                </span>
              </div>
            )}
            
            {company.founded_year && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Founded in {company.founded_year}</span>
              </div>
            )}
            
            {company.annual_revenue_usd_readable && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Revenue: ${company.annual_revenue_usd_readable}</span>
              </div>
            )}
          </div>

          {/* Job Statistics */}
          {(company.num_jobs || company.num_jobs_last_30_days) && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Job Opportunities
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {company.num_jobs && (
                  <div>
                    <span className="text-muted-foreground">Total Jobs:</span>
                    <span className="ml-2 font-medium">{company.num_jobs}</span>
                  </div>
                )}
                {company.num_jobs_last_30_days && (
                  <div>
                    <span className="text-muted-foreground">Recent Jobs:</span>
                    <span className="ml-2 font-medium">{company.num_jobs_last_30_days} (last 30 days)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Description */}
          {company.long_description && (
            <div>
              <h3 className="font-semibold mb-2">About the Company</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company.long_description}
              </p>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            {company.url && (
              <Button variant="outline\" size="sm\" asChild>
                <a href={company.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            )}
            
            {company.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDetailsModal;