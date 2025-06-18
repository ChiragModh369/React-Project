import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseProps } from './CourseCard';
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { showLog } from '@/commonFunctions/Functions';
import { CLEAR_REGISTER_USER } from '@/redux/actions/types/reduxConst';
import { fetchRegisterUserAction, fetchLoginDataAction } from '@/redux/actions/mainAction';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { localStorageHelper } from '@/commonFunctions/localStorageHelper';
import { Constants } from '@/Constants';
import FullScreenLoader from './ui/FullScreenLoader';
import { useNavigate } from 'react-router-dom';
const formSchema = z
    .object({
        name: z.string().min(2, { message: 'Enter your name ' }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .max(32, { message: "Password must be at most 32 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type FormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    course?: CourseProps;
    title: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    open,
    onOpenChange,
    onSuccess,
    course,
    title,
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });


    const dispatch = useDispatch();
    const { toast } = useToast();
    const navigate = useNavigate()
    /* API for register user - Start */
    const clearAPI = () => {
        dispatch({ type: CLEAR_REGISTER_USER });
    }
    const callRegisterAPI = (values: FormValues) => {
        const data = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword
        };
        showLog("callRegisterAPI", data)
        dispatch(fetchRegisterUserAction(data));
    };

    const {
        isCreatingLoading,
        creatingStatusCode,
        creatingMessage,
        creatingMainData,
    } = useSelector(data => data.registerUserReducer);

    useApiStatusHandler({
        statusCode: creatingStatusCode,
        message: creatingMessage,
        mainData: creatingMainData.data,
        clearAPI: clearAPI,
        onSuccess: mainData => {
            showLog("register user :", mainData)
            localStorageHelper.set(Constants.isLogin, true)
            localStorageHelper.set(Constants.loginData, mainData.user)
            dispatch(fetchLoginDataAction());

            form.reset();
            clearAPI()
            onSuccess()
            toast({
                title: creatingMessage,
                description: `Welcome, ${mainData.user?.name}`,
            });
           
        },
        toast,
        navigate
    });
    /* API for register user - End */
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {isCreatingLoading && <FullScreenLoader />}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(callRegisterAPI)} className="space-y-6">

                        {/* Name Input UI */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your full name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Input UI */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="example@domain.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Password Input UI */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                const [showPassword, setShowPassword] = useState(false);

                                return (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="123*****"
                                                className="pr-10" // space for icon
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        {/* Confirm Password Input UI */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => {
                                const [showPassword, setShowPassword] = useState(false);

                                return (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="123*****"
                                                className="pr-10" // space for icon
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <DialogFooter>
                            <Button type="submit">Sign Up</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterForm;
