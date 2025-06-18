import React, { useEffect, useRef, useState } from 'react';
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, FileText, Linkedin, Upload } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReadCoachesAction, fetchReadTimeSlotsAction, fetchBookSessionAction, fetchCoachPaymentAction } from '@/redux/actions/mainAction';
import { formatDateLocal, isUserLoggedIn, showLog } from '@/commonFunctions/Functions';
import { CLEAR_READ_TIMESLOTS, CLEAR_READ_COACHES, CLEAR_BOOK_COACH, CLEAR_COACH_PAYMENT } from '@/redux/actions/types/reduxConst';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { loadStripe } from '@stripe/stripe-js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BASE_API_URL, STRIPE_KEY } from '@/redux/config';

const stripePromise = loadStripe(STRIPE_KEY);

const bookingSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  date: z.date({
    required_error: "Please select a date for your coaching session.",
  }),
  timeSlot: z.string().min(1, {
    message: "Please select a time slot.",
  }),
  notes: z.string().optional(),
  cv: z.instanceof(File).optional(),
  jobDescription: z.instanceof(File).optional(),
});

const Coaching = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof bookingSchema> | null>(null);
  const hasBooked = useRef(false);

  const location = useLocation();


  /* API for booking session - Start */
  const clearBookSessionAPI = () => {
    dispatch({ type: CLEAR_BOOK_COACH });
  };

  const callBookSessionAPI = (values: z.infer<typeof bookingSchema>, coachId: number) => {

    const uploadedCvUrl = localStorage.getItem("uploaded_cv_url");
    const uploadedJdUrl = localStorage.getItem("uploaded_jd_url");

    const data = {
      email: values.email,
      name: values.name,
      time_slots_id: values.timeSlot,
      session_date: formatDateLocal(values.date),
      coach_id: coachId,
      additional_notes: values.notes,
      curriculum_vitae: values.cv,
      job_description: values.jobDescription,
      cv_url: uploadedCvUrl || "",
      jd_url: uploadedJdUrl || "",
    };
    
    dispatch(fetchBookSessionAction(data)); 
  };
  
  const {
    isBookingLoading,
    bookingStatusCode,
    bookingMessage,
    bookingMainData,
  } = useSelector(data => data.bookCoachSessionReducer);

  useApiStatusHandler({
    statusCode: bookingStatusCode,
    message: bookingMessage,
    mainData: bookingMainData,
    clearAPI: clearBookSessionAPI,
    onSuccess: () => {
      toast({
        title: "🎉 Coaching session booked successfully!",
        description: `Your session is confirmed. Check your email for details.`,
      });
      handleBackPress();
    },
    toast,
    navigate,
  });

  useEffect(() => {
    stripePromise.catch((err) => {
        showLog('Stripe initialization error', err);
        toast({
          title: 'Stripe Error',
          description: 'Failed to initialize Stripe. Please try again.',
          variant: 'destructive',
        });
      });
  }, [toast]);

  useEffect(() => {
  const paymentStatus = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  if (paymentStatus === 'success' && sessionId) {
    if (hasBooked.current) return;
    hasBooked.current = true;

    toast({
      title: 'Payment Successful!',
      description: 'Finalizing your booking, please wait...',
    });

    const savedFormDataString = localStorage.getItem('bookingFormData');
    const savedCoachIdString = localStorage.getItem('selectedCoach');

    if (savedFormDataString && savedCoachIdString) {
      try {
        const parsedFormData = JSON.parse(savedFormDataString);
        const parsedCoachId = JSON.parse(savedCoachIdString);

        const validated = bookingSchema.safeParse({
          ...parsedFormData,
          date: new Date(parsedFormData.date),
        });

        if (!validated.success) {
          showLog("Invalid form data recovered from localStorage", validated.error.format());
          toast({
            title: "Invalid booking data",
            description: "Please re-book your session. Something went wrong.",
            variant: "destructive",
          });
          return;
        }

        const uploadedCvUrl = localStorage.getItem("uploaded_cv_url");
        const uploadedJdUrl = localStorage.getItem("uploaded_jd_url");

        if (!uploadedCvUrl || !uploadedJdUrl) {
          toast({
            title: "Missing Files",
            description: "Uploaded file URLs not found. Please re-upload your CV and Job Description.",
            variant: "destructive",
          });
          return;
        }

        callBookSessionAPI(validated.data, parsedCoachId);

      } catch (error) {
        console.error("Error processing booking data:", error);
        toast({
          title: 'Booking Error',
          description: 'Could not retrieve booking details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        localStorage.removeItem('bookingFormData');
        localStorage.removeItem('selectedCoach');
        localStorage.removeItem("uploaded_cv_url");
        localStorage.removeItem("uploaded_jd_url");
      }
    } else {
      toast({
        title: 'Booking Confirmation Failed',
        description: 'Your session details were not found. Please contact support.',
        variant: 'destructive',
      });
    }
  } else if (paymentStatus === 'cancel') {
    toast({
      title: 'Payment Cancelled',
      description: 'Your payment was cancelled. Please try again.',
      variant: 'destructive',
    });
    localStorage.removeItem('bookingFormData');
    localStorage.removeItem('selectedCoach');
    localStorage.removeItem("uploaded_cv_url");
    localStorage.removeItem("uploaded_jd_url");
  }
}, [searchParams, dispatch, toast]);

  useEffect(() => {
    if (location.search) {
      const cleanUrl = window.location.origin + location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location]);


  const { isPaymentLoading, paymentMainData } = useSelector((data) => data.coachPaymentReducer);
  useEffect(() => {
    if (paymentMainData?.id && !isPaymentLoading) {
      stripePromise
        .then((stripe) => {
          if (stripe) {
            stripe.redirectToCheckout({ sessionId: paymentMainData.id }).then(({ error }) => {
              if (error) {
                toast({
                  title: 'Stripe Error',
                  description: error.message,
                  variant: 'destructive',
                });
              }
            });
          }
        });
    }
  }, [paymentMainData, isPaymentLoading, toast]);

  useEffect(() => {
    dispatch(fetchReadCoachesAction({}));
  }, [dispatch]);

  const {
    isCoachesLoading,
    coachMainData,
  } = useSelector(data => data.readCoachReducer);
  
  const clearTimeSlotsAPI = () => {
    dispatch({ type: CLEAR_READ_TIMESLOTS });
  };
  
  const callTimeSlotsAPI = (id) => {
    dispatch(fetchReadTimeSlotsAction({ id }));
  };

  const {
    isTimeSlotLoading,
    timeSlotStatusCode,
    timeSlotMessage,
    timeSlotMainData,
  } = useSelector(data => data.readTimeSlotsReducer);

  useApiStatusHandler({
    statusCode: timeSlotStatusCode,
    message: timeSlotMessage,
    mainData: timeSlotMainData,
    clearAPI: clearTimeSlotsAPI,
    onSuccess: () => {},
    toast,
    navigate,
  });

  const { paymentStatusCode, paymentMessage, error } = useSelector(
    (data) => data.coachPaymentReducer
  );

  useApiStatusHandler({
    statusCode: paymentStatusCode,
    message: paymentMessage || error,
    mainData: paymentMainData,
    clearAPI: () => dispatch({ type: CLEAR_COACH_PAYMENT }),
    onSuccess: () => {},
    onError: () => {
      if (error) {
        toast({
          title: 'Payment Error',
          description: error,
          variant: 'destructive',
        });
      }
    },
    toast,
    navigate,
  });

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleBackPress = () => {
    form.reset();
    setSelectedCoach(null);
    setCv(null);
    setJobDescription(null);
    setFormData(null);
    clearTimeSlotsAPI();
    clearBookSessionAPI();
    setStep(1);
    hasBooked.current = false;
  };

  const handleCoachSelect = (coachId: number, id: number) => {
    if (!isUserLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a coaching session.",
        variant: "destructive",
      });
      return;
    }
    setSelectedCoach(coachId);
    callTimeSlotsAPI(id);
    setStep(2);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCv(file);
      form.setValue("cv", file, { shouldValidate: true });
    }
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setJobDescription(file);
      form.setValue("jobDescription", file, { shouldValidate: true });
    }
  };

  const handlePaymentSubmit = async () => {
    showLog("handlePaymentSubmit called with formData:", formData);
  if (formData && selectedCoach !== null) {
      try {
        // 1. Upload files first
        await uploadFilesBeforePayment(formData.cv, formData.jobDescription);

        // 2. Save form data to localStorage (except files)
        const dataToStore = {
          ...formData,
          date: formData.date.toISOString(),
          cv: undefined,
          jobDescription: undefined,
        };

        localStorage.setItem('bookingFormData', JSON.stringify(dataToStore));
        localStorage.setItem('selectedCoach', JSON.stringify(selectedCoach));

        // 3. Prepare and call payment API
        const paymentPayload = {
          coach_id: selectedCoach,
          session_date: formatDateLocal(formData.date),
          time_slots_id: formData.timeSlot,
          name: formData.name,
          email: formData.email,
        };

        dispatch(fetchCoachPaymentAction(paymentPayload));
        setShowConfirmation(false);

      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: error.message || 'Failed to upload files. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const uploadFilesBeforePayment = async (cvFile, jdFile) => {
    const formData = new FormData();
    if (cvFile) formData.append("curriculum_vitae", cvFile);
    if (jdFile) formData.append("job_description", jdFile);

    const res = await fetch(`${BASE_API_URL}temp-upload`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!result.status) throw new Error(result.message || "Upload failed");

    // Save file URLs to localStorage
    localStorage.setItem("uploaded_cv_url", result.data.curriculum_vitae || "");
    localStorage.setItem("uploaded_jd_url", result.data.job_description || "");
  };


  const isLoading = isCoachesLoading || isTimeSlotLoading || isBookingLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-16 bg-cyber-dark-blue border-b border-cyber-blue/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Interview Coaching</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Schedule a one-on-one session with a cybersecurity professional to prepare for your next interview.
            </p>
          </div>
          {isLoading && <FullScreenLoader />}
          {step === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Select a Coach</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coachMainData?.map?.((coach) => (
                  <Card
                    key={coach.id}
                    className={`p-6 cursor-pointer hover:border-cyber-blue transition-all ${selectedCoach === coach.id ? 'border-2 border-cyber-blue' : ''} cyber-border`}
                    onClick={() => handleCoachSelect(coach.coach_id, coach.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img
                          src={coach.profile_image}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{coach.name}</h3>
                      <p className="text-cyber-blue mb-2">{coach.profession}</p>
                      {coach.linkedin && (
                        <a 
                          href={coach.linkedin.startsWith('http') ? coach.linkedin : `https://${coach.linkedin}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyber-blue hover:text-cyber-blue/80 mb-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">LinkedIn Profile</span>
                        </a>
                      )}
                      <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {coach?.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-cyber-blue/10 text-cyber-blue px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Available: {coach.availability}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <Button
                  variant="ghost"
                  className="mb-6"
                  onClick={handleBackPress}
                >
                  ← Back to Coaches
                </Button>
                <Card className="p-6 bg-card/50 border-cyber-blue/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                            src={coachMainData?.find(c => c.coach_id === selectedCoach)?.profile_image}
                            alt={coachMainData?.find(c => c.coach_id === selectedCoach)?.name}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                            {coachMainData?.find(c => c.coach_id === selectedCoach)?.name}
                            </h2>
                            <p className="text-cyber-blue">
                            {coachMainData?.find(c => c.coach_id === selectedCoach)?.profession}
                            </p>
                        </div>
                        </div>
                        <div className="text-right">
                        <div className="text-3xl font-bold text-primary mb-1">
                            ${coachMainData?.find(c => c.coach_id === selectedCoach)?.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            per session
                        </div>
                        </div>
                    </div>
                </Card>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Form fields remain the same */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Session Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                                }
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot {coachMainData?.find(c => c.coach_id === selectedCoach)?.timezone? ` (${coachMainData.find(c => c.coach_id === selectedCoach)?.timezone})`: ''}</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlotMainData[0]?.timeslots?.map((slot) => {
                              const slotId = String(slot.time_slots_id);
                              return (
                                <Button
                                  key={slot.time_slots_id}
                                  type="button"
                                  variant={field.value === slotId ? "default" : "outline"}
                                  className={cn(
                                    "h-10",
                                    field.value === slotId && "bg-cyber-blue text-black"
                                  )}
                                  onClick={() => form.setValue("timeSlot", slotId, { shouldValidate: true, shouldTouch: true })}
                                >
                                  {slot.start_time} - {slot.end_time}
                                </Button>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel htmlFor="cv">Upload Your CV</FormLabel>
                      <div className="mt-2">
                        <label
                          htmlFor="cv"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          ${cv ? 'bg-cyber-blue/5 border-cyber-blue' : 'border-gray-500 hover:border-cyber-blue'}`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {cv ? (
                              <>
                                <FileText className="w-8 h-8 text-cyber-blue mb-2" />
                                <p className="text-sm text-gray-400 truncate max-w-full px-2">{cv.name}</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-2" />
                                <p className="text-sm text-gray-400">Upload your CV</p>
                              </>
                            )}
                          </div>
                          <input
                            id="cv"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCvChange}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <FormLabel htmlFor="jobDescription">Upload Job Description</FormLabel>
                      <div className="mt-2">
                         <label
                          htmlFor="jobDescription"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          ${jobDescription ? 'bg-cyber-blue/5 border-cyber-blue' : 'border-gray-500 hover:border-cyber-blue'}`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {jobDescription ? (
                              <>
                                <FileText className="w-8 h-8 text-cyber-blue mb-2" />
                                <p className="text-sm text-gray-400 truncate max-w-full px-2">{jobDescription.name}</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-2" />
                                <p className="text-sm text-gray-400">Upload job description</p>
                              </>
                            )}
                          </div>
                          <input
                            id="jobDescription"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleJobDescriptionChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Let us know what specific areas you'd like to focus on..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                  >
                    Book Coaching Session
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>
            {formData && (
              <AlertDialogDescription>
                <div className="space-y-2 mt-4">
                  <p><strong>Coach:</strong> {coachMainData?.find(c => c.coach_id === selectedCoach)?.name}</p>
                  <p><strong>Date:</strong> {format(formData.date, "PPP")}</p>
                  <p><strong>Time:</strong> {timeSlotMainData[0]?.timeslots?.find(slot => slot.time_slots_id === parseInt(formData.timeSlot))?.start_time} - {timeSlotMainData[0]?.timeslots?.find(slot => slot.time_slots_id === parseInt(formData.timeSlot))?.end_time}</p>
                  <p><strong>Price:</strong> ${coachMainData?.find(c => c.coach_id === selectedCoach)?.price}</p>
                </div>
                <p className="mt-4">You will be redirected to Stripe to complete your payment.</p>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePaymentSubmit}>
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
};

export default Coaching;