import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  // No sidebar or mobile menu logic here; handled by Navbar
  return (
    <div className="min-h-screen w-full bg-transparent overflow-x-hidden">
      {/* Main content */}
      <div className="w-full pt-16">
        <div className="p-2 sm:p-4 lg:p-8 w-full max-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}