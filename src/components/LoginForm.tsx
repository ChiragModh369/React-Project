import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { showLog } from '@/commonFunctions/Functions';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseProps } from './CourseCard';
import { Eye, EyeOff } from "lucide-react";
import RegisterForm from './RegisterForm';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { localStorageHelper } from '@/commonFunctions/localStorageHelper';
import { fetchLoginAdminAction, fetchLoginDataAction } from '@/redux/actions/mainAction';
import { CLEAR_ADMIN_LOGIN } from '@/redux/actions/types/reduxConst';
import { Constants } from '@/Constants';
import FullScreenLoader from './ui/FullScreenLoader';
import { useNavigate } from 'react-router-dom';
const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(32, { message: 'Password must be at most 32 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: FormValues) => void;
    course?: CourseProps;
    title: string;

}

const LoginForm: React.FC<LoginFormProps> = ({
    open,
    onOpenChange,
    onSubmit,
    course,
    title,

}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });


    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

    const handleRegisterDialog = () => {
        setIsRegisterDialogOpen(!isRegisterDialogOpen)
        showLog("handleRegisterDialog", isRegisterDialogOpen)
    }
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { toast } = useToast();
    /* API for login user - Start */
    const clearLoginAPI = () => {
        dispatch({ type: CLEAR_ADMIN_LOGIN });
    }
    const handleSubmit = (values: FormValues) => {
        const data = {
            email: values.email,
            password: values.password,
        };
        showLog("callLoginAPI", data)
        dispatch(fetchLoginAdminAction(data));
    };
    const {
        isAdminLoading,
        adminStatusCode,
        adminMessage,
        adminMainData,
    } = useSelector(data => data.loginReducer);

    useApiStatusHandler({
        statusCode: adminStatusCode,
        message: adminMessage,
        mainData: adminMainData.data,
        clearAPI: clearLoginAPI,
        onSuccess: mainData => {
            showLog("login user :", mainData)
            localStorageHelper.set(Constants.isLogin, true)
            localStorageHelper.set(Constants.loginData, mainData.user)
            dispatch(fetchLoginDataAction());
            form.reset();
            onOpenChange(false);
            toast({
                title: "Login successful",
                description: `Welcome, ${mainData.user?.name}`,
            });
            clearLoginAPI()
        },
        toast,
        navigate
    });
    /* API for login user  - End */


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {isAdminLoading && <FullScreenLoader />}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

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

                        {/* Register Now button UI */}

                        <div className="flex items-center space-x-1 text-sm leading-none">
                            <FormDescription>Don't have an account?</FormDescription>
                            <button
                                onClick={handleRegisterDialog}
                                className="text-white-600 hover:underline font-medium"
                                type="button"
                            >
                                Sign Up
                            </button>
                        </div>

                        <DialogFooter>
                            <Button type="submit">Sign In</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
            {/* Register Dialog */}
            {
                isRegisterDialogOpen &&
                <RegisterForm
                    open={isRegisterDialogOpen}
                    onOpenChange={handleRegisterDialog}
                    title="Create an Account"
                    onSuccess={() => {
                        handleRegisterDialog()
                        onOpenChange(false)

                        showLog("onsuccess register")
                    }}
                />
            }

        </Dialog>
    );
};

export default LoginForm;
