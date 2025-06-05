import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useTransactionGroupsStore from '../store/transactionGroupsStore';
import TransactionGroups from './TransactionGroups';
import { XMarkIcon } from '@heroicons/react/24/outline';

const XmlUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { groupTransactions, clearGroups, parsedTransactions } = useTransactionGroupsStore();

  const handleClearUpload = () => {
    clearGroups();
    toast.success('Uploaded file cleared');
  };

  const parseXmlContent = (xmlContent) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Extract SMS messages
      const messages = xmlDoc.getElementsByTagName('sms');
      const transactions = [];

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const body = message.getAttribute('body') || '';
        
        // Check if it's a debit message
        if (body.toLowerCase().includes('debited') || body.includes('Rs.')) {
          // Extract amount using regex
          const amountMatch = body.match(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)/);
          const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

          // Extract account number (last 4 digits)
          const accountMatch = body.match(/a\/c\s*(\d{4})/i);
          const accountLast4 = accountMatch ? accountMatch[1] : null;

          // Extract date from message
          const dateMatch = body.match(/(\d{2}\/\d{2}\/\d{2}|\d{2}-\d{2}-\d{4})/);
          const date = dateMatch ? dateMatch[1] : null;

          if (amount) {
            transactions.push({
              amount,
              accountLast4,
              date,
              description: body,
              originalMessage: body
            });
          }
        }
      }

      return transactions;
    } catch (error) {
      console.error('Error parsing XML:', error);
      toast.error('Error parsing XML file');
      return [];
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      const transactions = parseXmlContent(content);
      
      if (transactions.length > 0) {
        // Clear existing groups and create new ones
        clearGroups();
        groupTransactions(transactions);
        toast.success(`Successfully parsed ${transactions.length} transactions`);
      } else {
        toast.error('No transactions found in the file');
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/xml') {
      handleFileUpload(file);
    } else {
      toast.error('Please upload an XML file');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/80 border border-gray-700 rounded-xl p-8 shadow-xl"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Upload SMS XML File
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Drag and drop your XML file or click to browse
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xml"
            onChange={handleFileInput}
            className="hidden"
            id="xml-upload"
          />
          <label
            htmlFor="xml-upload"
            className="cursor-pointer inline-block"
          >
            <div className="space-y-2">
              <div className="text-gray-400">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="text-gray-300">
                <span className="text-indigo-400">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-gray-500">XML files only</p>
            </div>
          </label>
        </div>

        {parsedTransactions.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-200">
                Parsed Transactions
              </h3>
              <button
                onClick={handleClearUpload}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Clear Upload</span>
              </button>
            </div>
            <TransactionGroups />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default XmlUploader; 