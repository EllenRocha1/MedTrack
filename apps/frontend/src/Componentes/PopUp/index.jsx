import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

/**
 * Componente Popup Compacto Modernizado
 * @param {boolean} open - Estado de visibilidade
 * @param {function} setOpen - Função para alterar visibilidade
 * @param {object} texto - Objeto contendo { h2: string, sub: string }
 * @param {object} botao1 - Objeto contendo { label: string, funcao: function }
 * @param {string} type - Tipo do popup: 'info' | 'success' | 'warning' | 'danger'
 */
export default function Popup({ open, setOpen, texto, botao1, type = "info" }) {
  
  const configs = {
    danger: {
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      bgIcon: "bg-red-50",
      button: "bg-red-600 hover:bg-red-700 shadow-red-100",
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      bgIcon: "bg-green-50",
      button: "bg-green-600 hover:bg-green-700 shadow-green-100",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50",
      button: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
    },
    info: {
      icon: <Info className="w-5 h-5 text-cyan-600" />,
      bgIcon: "bg-cyan-50",
      button: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-100",
    },
  };

  const config = configs[type] || configs.info;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
          {/* Overlay com desfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
          />

          {/* Container do Modal Compacto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-5">
              {/* Layout Horizontal: Ícone + Textos */}
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 ${config.bgIcon}`}>
                  {config.icon}
                </div>
                <div className="flex-1 pt-0.5">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {texto.h2}
                  </h2>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                    {texto.sub}
                  </p>
                </div>
              </div>

              {/* Ações Lado a Lado */}
              <div className="flex gap-2 justify-end mt-6">
                <button
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className={`px-4 py-2 text-sm font-bold text-white rounded-xl transition-all active:scale-95 shadow-lg ${config.button}`}
                  onClick={() => {
                    botao1.funcao();
                    setOpen(false);
                  }}
                >
                  {botao1.label}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
