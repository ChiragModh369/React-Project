import React, { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, Wand2 } from "lucide-react";
import { resumeSchema, type Resume } from "@/types/resumeTypes";
import {
  enhanceWithAI,
  generatePDF,
  saveResume,
} from "@/services/resumeService";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import ResumePreview, {
  renderResumeHTML,
} from "@/components/resume/ResumePreview";
import TemplateSelector from "@/components/resume/TemplateSelector";
import JobTargeting from "@/components/resume/JobTargeting";
import { useDispatch, useSelector } from "react-redux";
import { showLog } from "@/commonFunctions/Functions";
import {
  INITIATE_FETCH_READ_TEMPLATES,
  CLEAR_READ_TEMPLATES,
  INITIATE_FETCH_READ_PROFILE,
  CLEAR_READ_PROFILE,
  INITIATE_UPDATE_PROFILE,
  CLEAR_UPDATE_PROFILE,
  INITIATE_FETCH_READ_EXPERIENCES,
  CLEAR_READ_EXPERIENCES,
  INITIATE_UPDATE_EXPERIENCES,
  CLEAR_UPDATE_EXPERIENCES,
  INITIATE_DELETE_EXPERIENCES,
  CLEAR_DELETE_EXPERIENCES,
  INITIATE_FETCH_READ_EDUCATIONS,
  CLEAR_READ_EDUCATIONS,
  INITIATE_UPDATE_EDUCATIONS,
  CLEAR_UPDATE_EDUCATIONS,
  INITIATE_DELETE_EDUCATIONS,
  CLEAR_DELETE_EDUCATIONS,
  INITIATE_FETCH_READ_SKILLS,
  CLEAR_READ_SKILLS,
  INITIATE_STORE_SKILLS,
  CLEAR_STORE_SKILLS,
  INITIATE_DELETE_SKILLS,
  CLEAR_DELETE_SKILLS,
  INITIATE_FETCH_READ_SKILL_CATEGORIES,
  CLEAR_READ_SKILL_CATEGORIES,
  INITIATE_FETCH_READ_PROFICIENCY_LEVELS,
  CLEAR_READ_PROFICIENCY_LEVELS,
} from "@/redux/actions/types/reduxConst";
import useApiStatusHandler from "@/hooks/useApiStatusHandler";
import { Loader } from "@/components/ui/loader";
import { JobProps } from "@/types/jobTypes";

const CVBuilderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<
    "template" | "details" | "enhance"
  >("template");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobProps | null>(null);
  const [jobUrl, setJobUrl] = useState<string | undefined>(undefined); // Store the job URL
  const isInitialMount = useRef(true);

  const {
    isTemplateLoading,
    templateStatusCode,
    templateMessage,
    templateMainData,
  } = useSelector((data) => data.readTemplateReducer);

  const {
    isProfileLoading,
    profileStatusCode,
    profileMessage,
    profileMainData,
  } = useSelector((data) => data.readProfileReducer);

  const { isProfileUpdating, updateStatusCode, updateMessage, updateMainData } =
    useSelector((data) => data.updateProfileReducer);

  const {
    isExperienceLoading,
    experienceStatusCode,
    experienceMessage,
    experienceMainData,
  } = useSelector((data) => data.readExperienceReducer);

  const {
    isExperienceUpdating,
    updateExperienceStatusCode,
    updateExperienceMessage,
    updateExperienceMainData,
  } = useSelector((data) => data.updateExperienceReducer);

  const {
    isExperienceDeleting,
    deleteExperienceStatusCode,
    deleteExperienceMessage,
    deleteExperienceMainData,
  } = useSelector((data) => data.deleteExperienceReducer);

  const {
    isEducationLoading,
    educationStatusCode,
    educationMessage,
    educationMainData,
  } = useSelector((data) => data.readEducationReducer);

  const {
    isEducationUpdating,
    updateEducationStatusCode,
    updateEducationMessage,
    updateEducationMainData,
  } = useSelector((data) => data.updateEducationReducer);

  const {
    isEducationDeleting,
    deleteEducationStatusCode,
    deleteEducationMessage,
    deleteEducationMainData,
  } = useSelector((data) => data.deleteEducationReducer);

  const { isSkillLoading, skillStatusCode, skillMessage, skillMainData } =
    useSelector((data) => data.readSkillReducer);

  const {
    isSkillStoring,
    storeSkillStatusCode,
    storeSkillMessage,
    storeSkillMainData,
  } = useSelector((data) => data.storeSkillReducer);

  const {
    isSkillDeleting,
    deleteSkillStatusCode,
    deleteSkillMessage,
    deleteSkillMainData,
  } = useSelector((data) => data.deleteSkillReducer);

  const {
    isSkillCategoryLoading,
    skillCategoryStatusCode,
    skillCategoryMessage,
    skillCategoryMainData,
  } = useSelector((data) => data.readSkillCategoryReducer);

  const {
    isProficiencyLevelLoading,
    proficiencyLevelStatusCode,
    proficiencyLevelMessage,
    proficiencyLevelMainData,
  } = useSelector((data) => data.readProficiencyLevelReducer);

  const methods = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      template: "",
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
        linkedin: "",
        website: "",
        github: "",
      },
      experiences: [],
      education: [],
      skills: [],
    },
  });

  const originalProfileDataRef = useRef(null);
  const originalExperienceDataRef = useRef(null);
  const originalEducationDataRef = useRef(null);
  const originalSkillDataRef = useRef(null);

  useEffect(() => {
    showLog(
      "Dispatching template, profile, experiences, educations, skills, skill categories, and proficiency levels fetch"
    );
    dispatch({ type: INITIATE_FETCH_READ_TEMPLATES, payload: {} });
    dispatch({ type: INITIATE_FETCH_READ_PROFILE });
    dispatch({ type: INITIATE_FETCH_READ_EXPERIENCES, payload: {} });
    dispatch({ type: INITIATE_FETCH_READ_EDUCATIONS, payload: {} });
    dispatch({ type: INITIATE_FETCH_READ_SKILLS, payload: {} });
    dispatch({ type: INITIATE_FETCH_READ_SKILL_CATEGORIES, payload: {} });
    dispatch({ type: INITIATE_FETCH_READ_PROFICIENCY_LEVELS, payload: {} });
  }, [dispatch]);

  useEffect(() => {
    if (profileMainData?.data) {
      showLog("Setting original profile data", profileMainData.data);
      originalProfileDataRef.current = profileMainData.data;
    }
  }, [profileMainData]);

  useEffect(() => {
    if (experienceMainData) {
      showLog("Setting original experience data", experienceMainData);
      originalExperienceDataRef.current = experienceMainData;
    }
  }, [experienceMainData]);

  useEffect(() => {
    if (educationMainData) {
      showLog("Setting original education data", educationMainData);
      originalEducationDataRef.current = educationMainData;
    }
  }, [educationMainData]);

  useEffect(() => {
    if (skillMainData) {
      showLog("Setting original skill data", skillMainData);
      originalSkillDataRef.current = skillMainData;
    }
  }, [skillMainData]);

  // Handle template selection
  useApiStatusHandler({
    statusCode: templateStatusCode,
    message: templateMessage,
    mainData: templateMainData,
    clearAPI: () => dispatch({ type: CLEAR_READ_TEMPLATES }),
    onSuccess: (mainData) => {
      setSelectedTemplate(mainData?.[0]);
    },
    toast,
    navigate,
  });

  // Handle profile data loading
  useApiStatusHandler({
    statusCode: profileStatusCode,
    message: profileMessage,
    mainData: profileMainData?.data,
    clearAPI: () => dispatch({ type: CLEAR_READ_PROFILE }),
    onSuccess: (mainData) => {
      showLog("Personal info data loaded", mainData);
      if (mainData) {
        const personalInfoData = {
          fullName: mainData?.full_name || "",
          email: mainData?.email || "",
          phone: mainData?.phone || "",
          location: mainData?.location || "",
          title: mainData?.professional_title || "",
          summary: mainData?.professional_summary || "",
          linkedin: mainData?.linkedIn || "",
          github: mainData?.github || "",
          website: mainData?.personal_website || "",
        };
        methods.setValue("personalInfo", personalInfoData, {
          shouldDirty: true,
        });
        showLog("Set personalInfo in form", personalInfoData);
      }
    },
    toast,
    navigate,
  });

  // Handle experience data loading
  useApiStatusHandler({
    statusCode: experienceStatusCode,
    message: experienceMessage,
    mainData: experienceMainData,
    clearAPI: () => dispatch({ type: CLEAR_READ_EXPERIENCES }),
    onSuccess: (mainData) => {
      showLog("Experience data loaded", mainData);
      showLog("MAIN DATA", mainData);

      if (Array.isArray(mainData) && mainData.length > 0) {
        const mappedExperiences = mainData.map((exp) => ({
          experienceId: exp.id ? String(exp.id) : undefined,
          company: exp.company_name || "",
          position: exp.position || "",
          startDate: exp.start_date || "",
          endDate: exp.end_date || "",
          description: exp.description || "",
        }));

        methods.setValue("experiences", mappedExperiences, {
          shouldDirty: true,
        });

        showLog("Experiences set in form", mappedExperiences);
      }
    },
    onError: (error) => {
      showLog("Experience fetch failed", error);
      toast({
        title: "Error",
        description: "Failed to load experiences.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle education data loading
  useApiStatusHandler({
    statusCode: educationStatusCode,
    message: educationMessage,
    mainData: educationMainData,
    clearAPI: () => dispatch({ type: CLEAR_READ_EDUCATIONS }),
    onSuccess: (mainData) => {
      showLog("Education data loaded", mainData);
      if (Array.isArray(mainData) && mainData.length > 0) {
        const mappedEducations = mainData.map((edu) => ({
          educationId: edu.id ? String(edu.id) : undefined,
          institution: edu.institution || "",
          degree: edu.degree || "",
          year: edu.year || "",
          description: edu.additional_information || "",
        }));

        methods.setValue("education", mappedEducations, {
          shouldDirty: true,
        });

        showLog("Educations set in form", mappedEducations);
      }
    },
    onError: (error) => {
      showLog("Education fetch failed", error);
      toast({
        title: "Error",
        description: "Failed to load educations.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle skills data loading
  useApiStatusHandler({
    statusCode: skillStatusCode,
    message: skillMessage,
    mainData: skillMainData,
    clearAPI: () => dispatch({ type: CLEAR_READ_SKILLS }),
    onSuccess: (mainData) => {
      showLog("Skills data loaded", mainData);
      if (Array.isArray(mainData) && mainData.length > 0) {
        const mappedSkills = mainData.map((skill) => ({
          skillId: skill.id ? String(skill.id) : undefined,
          name: skill.skill_name || "",
          level: skill.proficiency_level || "",
          category: skill.category || "",
        }));

        methods.setValue("skills", mappedSkills, {
          shouldDirty: true,
        });

        showLog("Skills set in form", mappedSkills);
      }
    },
    onError: (error) => {
      showLog("Skills fetch failed", error);
      toast({
        title: "Error",
        description: "Failed to load skills.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle skill storing
  useApiStatusHandler({
    statusCode: storeSkillStatusCode,
    message: storeSkillMessage,
    mainData: storeSkillMainData,
    clearAPI: () => dispatch({ type: CLEAR_STORE_SKILLS }),
    onSuccess: (mainData) => {
      showLog("Skill stored successfully", mainData);
      toast({
        title: "Success",
        description: "Skill added successfully.",
      });
    },
    onError: (error) => {
      showLog("Skill store failed", error);
      toast({
        title: "Error",
        description: "Failed to add skill.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle skill deletion
  useApiStatusHandler({
    statusCode: deleteSkillStatusCode,
    message: deleteSkillMessage,
    mainData: deleteSkillMainData,
    clearAPI: () => dispatch({ type: CLEAR_DELETE_SKILLS }),
    onSuccess: (mainData) => {
      showLog("Skill deleted successfully", mainData);
      toast({
        title: "Success",
        description: "Skill deleted successfully.",
      });
    },
    onError: (error) => {
      showLog("Skill deletion failed", error);
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle skill categories loading
  useApiStatusHandler({
    statusCode: skillCategoryStatusCode,
    message: skillCategoryMessage,
    mainData: skillCategoryMainData,
    clearAPI: () => dispatch({ type: CLEAR_READ_SKILL_CATEGORIES }),
    onSuccess: (mainData) => {
      showLog("Skill categories loaded successfully", mainData);
    },
    onError: (error) => {
      showLog("Skill categories fetch failed", error);
      toast({
        title: "Error",
        description: "Failed to load skill categories.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle proficiency levels loading
  useApiStatusHandler({
    statusCode: proficiencyLevelStatusCode,
    message: proficiencyLevelMessage,
    mainData: proficiencyLevelMainData,
    clearAPI: () => dispatch({ type: CLEAR_READ_PROFICIENCY_LEVELS }),
    onSuccess: (mainData) => {
      showLog("Proficiency levels loaded successfully", mainData);
    },
    onError: (error) => {
      showLog("Proficiency levels fetch failed", error);
      toast({
        title: "Error",
        description: "Failed to load proficiency levels.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle education updates
  useApiStatusHandler({
    statusCode: updateEducationStatusCode,
    message: updateEducationMessage,
    mainData: updateEducationMainData,
    clearAPI: () => dispatch({ type: CLEAR_UPDATE_EDUCATIONS }),
    onSuccess: (mainData) => {
      showLog("Educations updated successfully", mainData);
      toast({
        title: "Success",
        description: "Educations updated successfully.",
      });

      // Update form with new education IDs
      const createdIds = mainData?.data?.created || [];
      if (createdIds.length > 0) {
        const currentEducations = methods.getValues("education");
        const newEducationIndices = currentEducations
          .map((edu, index) => (!edu.educationId ? index : -1))
          .filter((index) => index !== -1);

        if (newEducationIndices.length === createdIds.length) {
          const updatedEducations = [...currentEducations];
          newEducationIndices.forEach((index, i) => {
            updatedEducations[index].educationId = String(createdIds[i]);
          });
          methods.setValue("education", updatedEducations, {
            shouldDirty: false,
          });
          showLog("Updated form with new education IDs", updatedEducations);
        } else {
          showLog("Mismatch in number of new educations and created IDs");
        }
      }

      // Fetch updated educations to reflect in other parts of the app
      dispatch({ type: INITIATE_FETCH_READ_EDUCATIONS, payload: {} });
    },
    onError: (error) => {
      showLog("Education update failed", error);
      toast({
        title: "Error",
        description: "Failed to update educations.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle education deletions
  useApiStatusHandler({
    statusCode: deleteEducationStatusCode,
    message: deleteEducationMessage,
    mainData: deleteEducationMainData,
    clearAPI: () => dispatch({ type: CLEAR_DELETE_EDUCATIONS }),
    onSuccess: (mainData) => {
      showLog("Education deleted successfully", mainData);
      toast({
        title: "Success",
        description: "Education deleted successfully.",
      });
    },
    onError: (error) => {
      showLog("Education deletion failed", error);
      toast({
        title: "Error",
        description: "Failed to delete education.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle experience updates
  useApiStatusHandler({
    statusCode: updateExperienceStatusCode,
    message: updateExperienceMessage,
    mainData: updateExperienceMainData,
    clearAPI: () => dispatch({ type: CLEAR_UPDATE_EXPERIENCES }),
    onSuccess: (mainData) => {
      showLog("Experiences updated successfully", mainData);
      toast({
        title: "Success",
        description: "Experiences updated successfully.",
      });

      // Update form with new experience IDs
      const createdIds = mainData?.data?.created || [];
      if (createdIds.length > 0) {
        const currentExperiences = methods.getValues("experiences");
        const newExperiencesIndices = currentExperiences
          .map((exp, index) => (!exp.experienceId ? index : -1))
          .filter((index) => index !== -1);

        if (newExperiencesIndices.length === createdIds.length) {
          const updatedExperiences = [...currentExperiences];
          newExperiencesIndices.forEach((index, i) => {
            updatedExperiences[index].experienceId = String(createdIds[i]);
          });
          methods.setValue("experiences", updatedExperiences, {
            shouldDirty: false,
          });
          showLog("Updated form with new experience IDs", updatedExperiences);
        } else {
          showLog("Mismatch in number of new experiences and created IDs");
        }
      }

      // Fetch updated experiences to reflect in other parts of the app
      dispatch({ type: INITIATE_FETCH_READ_EXPERIENCES, payload: {} });
    },
    onError: (error) => {
      showLog("Experience update failed", error);
      toast({
        title: "Error",
        description: "Failed to update experiences.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle experience deletions
  useApiStatusHandler({
    statusCode: deleteExperienceStatusCode,
    message: deleteExperienceMessage,
    mainData: deleteExperienceMainData,
    clearAPI: () => dispatch({ type: CLEAR_DELETE_EXPERIENCES }),
    onSuccess: (mainData) => {
      showLog("Experience deleted successfully", mainData);
      toast({
        title: "Success",
        description: "Experience deleted successfully.",
      });
    },
    onError: (error) => {
      showLog("Experience deletion failed", error);
      toast({
        title: "Error",
        description: "Failed to delete experiences.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  // Handle profile updates
  useApiStatusHandler({
    statusCode: updateStatusCode,
    message: updateMessage,
    mainData: updateMainData,
    clearAPI: () => dispatch({ type: CLEAR_UPDATE_PROFILE }),
    onSuccess: (mainData) => {
      showLog("Profile updated successfully", mainData);
    },
    onError: (error) => {
      showLog("Profile update failed", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
    toast,
    navigate,
  });

  const updateProfile = (personalInfo) => {
    showLog("Dispatching update profile", personalInfo);
    dispatch({
      type: INITIATE_UPDATE_PROFILE,
      payload: {
        full_name: personalInfo.fullName || "",
        professional_title: personalInfo.title || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        location: personalInfo.location || "",
        professional_summary: personalInfo.summary || "",
        linkedIn: personalInfo.linkedin || "",
        github: personalInfo.github || "",
        personal_website: personalInfo.website || "",
      },
    });
  };

  const deleteExperiences = (experienceIds: string[]) => {
    showLog("Dispatching delete experiences", experienceIds);
    dispatch({
      type: INITIATE_DELETE_EXPERIENCES,
      payload: experienceIds,
    });
  };

  const updateExperiences = (payload) => {
    showLog("Dispatching update experiences", payload);
    dispatch({
      type: INITIATE_UPDATE_EXPERIENCES,
      payload,
    });
  };

  const updateEducations = (payload) => {
    showLog("Dispatching update educations", payload);
    dispatch({
      type: INITIATE_UPDATE_EDUCATIONS,
      payload,
    });
  };

  const deleteEducations = (educationId: string) => {
    showLog("Dispatching delete education", educationId);
    dispatch({
      type: INITIATE_DELETE_EDUCATIONS,
      payload: educationId,
    });
  };

  const storeSkill = (payload) => {
    showLog("Dispatching store skill", payload);
    dispatch({
      type: INITIATE_STORE_SKILLS,
      payload,
    });
  };

  const deleteSkill = (skillId: string) => {
    showLog("Dispatching delete skill", skillId);
    dispatch({
      type: INITIATE_DELETE_SKILLS,
      payload: skillId,
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    methods.setValue("template", template);
    setActiveStep("details");
  };

  const handleJobSelect = (job: JobProps | null, url?: string) => {
    setSelectedJob(job);
    setJobUrl(url); // Update the job URL
  };

  const handleEnhanceResume = async () => {
    try {
      setIsEnhancing(true);
      const formData = methods.getValues();
      const enhancedResume = await enhanceWithAI(
        formData,
        selectedJob?.description
      );
      methods.reset(enhancedResume);
      toast({
        title: "Resume Enhanced",
        description: "Your resume has been enhanced with AI suggestions",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const formData = methods.getValues();
      const renderedHTML = renderResumeHTML(
        selectedTemplate?.html_content || "",
        formData
      );

      const pdfBlob = await generatePDF(renderedHTML);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      const safeFileName = formData.personalInfo.fullName.replace(/\s+/g, "_");
      link.download = `${safeFileName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast({
        title: "PDF Generated",
        description: "Your resume has been downloaded as a PDF",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyNow = () => {
    if (jobUrl) {
      window.open(jobUrl, '_blank');
      toast({
        title: "Applying Now",
        description: "Redirecting to the job application page.",
      });
    } else {
      toast({
        title: "Error",
        description: "No application URL available for this job.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-cyber-dark-blue py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Resume Builder
            </h1>
            <p className="text-muted-foreground text-lg">
              Create a professional resume with our AI-powered builder
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeStep === "template" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Choose a Template</CardTitle>
                    <CardDescription>
                      Select a template that best suits your professional style
                    </CardDescription>
                  </CardHeader>
                  {isTemplateLoading || isProfileLoading ? (
                    <Loader />
                  ) : (
                    <CardContent>
                      <TemplateSelector
                        templates={templateMainData}
                        selectedTemplate={selectedTemplate}
                        onSelect={handleTemplateSelect}
                      />
                    </CardContent>
                  )}
                </Card>
              )}
              {activeStep === "details" && (
                <FormProvider {...methods}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Fill Your Details</CardTitle>
                      <CardDescription>
                        Enter your professional information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 w-full">
                          <TabsTrigger value="personal">Personal</TabsTrigger>
                          <TabsTrigger value="experience">
                            Experience
                          </TabsTrigger>
                          <TabsTrigger value="education">Education</TabsTrigger>
                          <TabsTrigger value="skills">Skills</TabsTrigger>
                        </TabsList>
                        <TabsContent value="personal">
                          {isProfileLoading ? (
                            <Loader />
                          ) : (
                            <>
                              <PersonalInfoForm updateProfile={updateProfile} />
                              <div className="flex justify-between mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setActiveStep("template")}
                                >
                                  Back to Templates
                                </Button>
                                <Button
                                  onClick={() => setActiveTab("experience")}
                                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                                >
                                  Next: Experience
                                </Button>
                              </div>
                            </>
                          )}
                        </TabsContent>
                        <TabsContent value="experience">
                          {isExperienceLoading ? (
                            <Loader />
                          ) : (
                            <>
                              <ExperienceForm
                                updateExperiences={updateExperiences}
                                deleteExperiences={deleteExperiences}
                                isInitialMount={isInitialMount}
                              />
                              <div className="flex justify-between mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setActiveTab("personal")}
                                >
                                  Back to Personal
                                </Button>
                                <Button
                                  onClick={() => setActiveTab("education")}
                                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                                >
                                  Next: Education
                                </Button>
                              </div>
                            </>
                          )}
                        </TabsContent>
                        <TabsContent value="education">
                          {isEducationLoading ? (
                            <Loader />
                          ) : (
                            <>
                              <EducationForm
                                updateEducations={updateEducations}
                                deleteEducations={deleteEducations}
                              />
                              <div className="flex justify-between mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setActiveTab("experience")}
                                >
                                  Back to Experience
                                </Button>
                                <Button
                                  onClick={() => setActiveTab("skills")}
                                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                                >
                                  Next: Skills
                                </Button>
                              </div>
                            </>
                          )}
                        </TabsContent>
                        <TabsContent value="skills">
                          {isSkillLoading ||
                          isSkillCategoryLoading ||
                          isProficiencyLevelLoading ? (
                            <Loader />
                          ) : (
                            <>
                              <SkillsForm
                                storeSkill={storeSkill}
                                deleteSkill={deleteSkill}
                              />
                              <div className="flex justify-between mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setActiveTab("education")}
                                >
                                  Back to Education
                                </Button>
                                <Button
                                  onClick={() => setActiveStep("enhance")}
                                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                                >
                                  Next: Enhance
                                </Button>
                              </div>
                            </>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </FormProvider>
              )}
              {activeStep === "enhance" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Enhance Your Resume</CardTitle>
                    <CardDescription>
                      Target specific jobs and enhance with AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <JobTargeting
                      selectedJob={selectedJob}
                      onJobSelect={handleJobSelect}
                    />
                    <div className="flex flex-col gap-4 mt-6">
                      {selectedJob && (
                        <Button
                          onClick={handleApplyNow}
                          className="bg-cyber-green hover:bg-cyber-green/80 text-black"
                        >
                          Apply Now
                        </Button>
                      )}
                      <Button
                        onClick={handleEnhanceResume}
                        disabled={isEnhancing}
                        className="bg-gradient-to-r from-cyber-blue to-cyber-green text-black"
                      >
                        {isEnhancing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enhancing with AI...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Enhance with AI
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleGeneratePDF}
                        disabled={isGenerating}
                        className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveStep("details")}
                      >
                        Back to Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="hidden lg:block lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Resume Preview</h2>
              {selectedTemplate && (
                <ResumePreview
                  resume={methods.watch()}
                  template={selectedTemplate}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CVBuilderPage;