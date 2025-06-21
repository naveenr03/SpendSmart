import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  HomeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/dashboard',
      icon: HomeIcon,
      label: 'Dashboard',
    },
    {
      path: '/dashboard/transactions',
      icon: CreditCardIcon,
      label: 'Transactions',
    },
    {
      path: '/dashboard/budget',
      icon: ChartBarIcon,
      label: 'Budget',
    },
    {
      path: '/dashboard/smart-budget',
      icon: LightBulbIcon,
      label: 'Smart Budget',
    },
    {
      path: '/dashboard/add-expense',
      icon: PlusCircleIcon,
      label: 'Add Expense',
    },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 w-full fixed top-0 left-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 w-full">
          <Link to="/" className="text-xl font-bold text-white flex-shrink-0">
            SpendSmart
          </Link>
          <div className="hidden lg:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
          <button
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex">
          <div className="w-64 max-w-full bg-gray-800 h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="text-xl font-bold text-white">Menu</span>
              <button
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${
                    isActive(item.path)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
} 