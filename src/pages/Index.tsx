import React from 'react';
import Navbar from '@/components/Navbar';
import FeaturedCourses from '@/components/FeaturedCourses';
import JobsSection from '@/components/JobsSection';
import CVBuilder from '@/components/CVBuilder';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-cyber-dark-blue border-b border-cyber-blue/20">
        <div className="absolute inset-0 code-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <div className="inline-block mb-6 p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/30">
                <Shield className="h-6 w-6 text-cyber-blue" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master Cyber Security with <span className="bg-gradient-to-r from-cyber-blue to-cyber-green bg-clip-text text-transparent animate-text-flicker">CyberQuays</span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Comprehensive training, career opportunities, and AI tools to accelerate your cybersecurity career.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-cyber-blue hover:bg-cyber-blue/80 text-black px-8 min-w-[200px]">
                  <Link to="/courses">
                    Explore Courses
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="cyber-border min-w-[200px]">
                  <Link to="/jobs">
                    Find Jobs
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="cyber-border min-w-[200px]">
                  <Link to="/cv-builder">
                    Build CV
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="cyber-border min-w-[200px]">
                  <Link to="/coaching">
                    Connect with a Coach
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="relative mx-auto max-w-md lg:max-w-full">
                <div className="aspect-video bg-cyber-blue/5 rounded-lg overflow-hidden cyber-border animate-pulse-glow">
                  <img 
                    src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1470&auto=format&fit=crop"
                    alt="Cybersecurity Training" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyber-dark-blue via-transparent to-transparent opacity-70"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm p-4 rounded">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-cyber-blue flex items-center justify-center">
                        <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-medium">Introduction to Cybersecurity</h3>
                        <p className="text-xs text-gray-300">Watch the free preview</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded cyber-border hidden md:block">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face" 
                          alt="Student" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face" 
                          alt="Student" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face" 
                          alt="Student" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-sm">2,500+ students enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-cyber-dark-blue/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-cyber-blue mb-2">50+</div>
              <div className="text-center text-sm text-muted-foreground">Expert Instructors</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-cyber-blue mb-2">120+</div>
              <div className="text-center text-sm text-muted-foreground">Courses Available</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-cyber-blue mb-2">15k+</div>
              <div className="text-center text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold text-cyber-blue mb-2">98%</div>
              <div className="text-center text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      {/* <FeaturedCourses /> */}
      
      {/* Jobs Section */}
      {/* <JobsSection /> */}
      
      {/* CV Builder Section */}
      <CVBuilder />
      
      {/* Become a Coach Section */}
      <section className="py-12 bg-cyber-dark-blue/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-cyber-blue mb-4">Join Our Team as a Coach</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Passionate about cybersecurity and eager to mentor the next generation? Reach out to us at{' '}
            <a href="mailto:info@cyberquays.com" className="text-cyber-blue hover:underline">
              info@cyberquays.com
            </a>{' '}
            to become a coach and inspire future experts. Our admin team will guide you through the process!
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;