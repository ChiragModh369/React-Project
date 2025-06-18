import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100 px-4 py-12">
        <div className="text-center max-w-lg">
          <h1 className="text-7xl font-extrabold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Oops! Page not found
          </h2>
          <p className="text-gray-500 mb-8">
            The page you are looking for doesn’t exist or has been moved.
          </p>
  
          <Link to="/">
            <Button className="bg-cyber-blue hover:bg-cyber-blue/80 text-black">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    );

};

export default NotFound;
