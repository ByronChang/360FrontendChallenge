
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Button asChild className="bg-primary-blue hover:bg-primary-dark">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
