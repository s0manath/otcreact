import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'error', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    className="fixed top-8 right-8 z-[100] min-w-[320px] max-w-[400px]"
                >
                    <div className={`
                        relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-md
                        ${type === 'error' 
                            ? 'bg-rose-50/90 border-rose-200 text-rose-800' 
                            : 'bg-emerald-50/90 border-emerald-200 text-emerald-800'}
                    `}>
                        {/* Progress bar background */}
                        <div className={`absolute bottom-0 left-0 h-1 transition-all duration-[3000ms] ease-linear w-0 ${type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: '100%' }} />

                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 rounded-full p-1 ${type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                            </div>
                            
                            <div className="flex-1 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 italic">
                                    {type === 'error' ? 'Validation Error' : 'Success'}
                                </p>
                                <p className="text-xs font-bold leading-relaxed">{message}</p>
                            </div>

                            <button 
                                onClick={onClose}
                                className="ml-2 rounded-lg p-1 hover:bg-black/5 transition-colors"
                            >
                                <X size={14} className="opacity-40 hover:opacity-100" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
