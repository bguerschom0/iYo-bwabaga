import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  className = '' 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sandbeige-200">
            <h2 className="text-xl font-semibold text-sandbeige-900">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sandbeige-500 hover:text-sandbeige-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 p-4 border-t border-sandbeige-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
