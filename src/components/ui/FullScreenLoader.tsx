import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader } from "./loader";
import { FormDescription } from '@/components/ui/form';
const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader /> {/* Or use any spinner/loading component */}
        </div>

            // <div className="flex justify-center items-center py-20">
            //   <Loader2 className="h-10 w-10 text-cyber-blue animate-spin" />
            //   <span className="ml-2 text-lg">Loading jobs...</span>
            // </div>
    );
};

export default FullScreenLoader;
