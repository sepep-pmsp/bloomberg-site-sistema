import React, { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY (Fundo escuro) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* CONTEÚDO DO MODAL */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              
              {/* CABEÇALHO */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[var(--bg-page-secondary)]">
                <h3 className="text-2xl font-bold text-[var(--color-primary)]">
                  {title || "Saiba Mais"}
                </h3>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors">
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              {/* CORPO (Scrollável) */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="text-lg leading-loose text-gray-700 whitespace-pre-line text-justify">
                  {children}
                </div>
              </div>

              {/* RODAPÉ (Opcional) */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button onClick={onClose} className="px-6 py-2 bg-[var(--green-600)] text-white rounded-lg hover:bg-[var(--green-800)] transition font-semibold">
                  Fechar
                </button>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}