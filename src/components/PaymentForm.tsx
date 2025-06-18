import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { showLog } from '@/commonFunctions/Functions';
import { Button } from '@/components/ui/button';
import { CourseProps } from './CourseCard';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { fetchCreatePaymentAction } from '@/redux/actions/mainAction';
import { CLEAR_CREATE_PAYMENT } from '@/redux/actions/types/reduxConst';
import FullScreenLoader from './ui/FullScreenLoader';
import { useNavigate } from 'react-router-dom';
import { STRIPE_KEY } from '@/redux/config';

interface PaymentFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (course_id: string) => void;
    course?: CourseProps;
    title: string;
    token: string,
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    open,
    onOpenChange,
    onSubmit,
    course,
    title,
    token
}) => {


    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { toast } = useToast();
    const stripePromise = loadStripe(STRIPE_KEY);

    /* API for payment - Start */
    const clearPaymentAPI = () => {
        dispatch({ type: CLEAR_CREATE_PAYMENT });
    }
    const handleSubmit = () => {
        const data = {
            course_id: course.id,
            token: token,
        };
        showLog("call payment api", data)
        dispatch(fetchCreatePaymentAction(data));
    };
    const {
        isPaymentLoading,
        paymentStatusCode,
        paymentMessage,
        paymentMainData,
    } = useSelector(data => data.createPaymentReducer);

    useApiStatusHandler({
        statusCode: paymentStatusCode,
        message: paymentMessage,
        mainData: paymentMainData,
        clearAPI: clearPaymentAPI,
        onSuccess: mainData => {
            showLog("payment id :", mainData)
            callStripe()
            // onOpenChange(false);
            // clearPaymentAPI()
        },
        toast,
        navigate
    });

    const callStripe = async () => {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: paymentMainData.id });//Redirect to stripe website
    }
    /* API for payment  - End */


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {isPaymentLoading && <FullScreenLoader />}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="mt-2 space-y-2">
                    <h4 className="font-medium text-foreground">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{course.duration}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Lessons</p>
                        <p className="font-medium">{course.lessons_count}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Level</p>
                        <p className="font-medium">{course.difficulty_level}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Instructor</p>
                        <p className="font-medium">{course.instructor}</p>
                    </div>
                </div>


                {course.is_paid ? (
                    <DialogFooter>
                        <Button onClick={handleSubmit}>Pay ${course.price}</Button>
                    </DialogFooter>
                ) : (
                    <DialogFooter>
                        <Button onClick={() => { onOpenChange(false); onSubmit(course.id) }}>Enroll</Button>
                    </DialogFooter>
                )}



            </DialogContent>

        </Dialog>
    );
};

export default PaymentForm;
