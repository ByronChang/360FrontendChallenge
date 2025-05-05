
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-blue">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Button asChild className="bg-primary-blue hover:bg-primary-dark">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
