const LoadingPulse = ({ message = "Carregando...", icon = "bolt", color = "purple" }) => {
  const themeClass = `theme-${color}`;

  return (
    <>
      <style>{`
        @keyframes lp-ping {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes lp-pulse {
          0%, 100% { transform: scale(1);    opacity: 1;   }
          50%       { transform: scale(1.12); opacity: 0.8; }
        }
        @keyframes lp-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .lp-ring  { animation: lp-ping   1.8s ease-out  infinite; }
        .lp-ring2 { animation: lp-ping   1.8s ease-out  infinite; animation-delay: 0.6s; }
        .lp-ring3 { animation: lp-ping   1.8s ease-out  infinite; animation-delay: 1.2s; }
        .lp-icon  { animation: lp-pulse  2s   ease-in-out infinite; }
        .lp-bar   {
          height: 6px; width: 112px; border-radius: 999px;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: lp-shimmer 1.5s infinite;
        }
      `}</style>

      <div className={`flex flex-col items-center justify-center py-10 gap-4 ${themeClass}`}>
        {/* ícone com anéis */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="lp-ring absolute w-16 h-16 rounded-full" />
          <span className="lp-ring2 absolute w-16 h-16 rounded-full" />
          <span className="lp-ring3 absolute w-16 h-16 rounded-full" />
          <div
            className="lp-icon relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
          >
            <i className={`ti ti-${icon} text-white text-xl`} aria-hidden="true" />
          </div>
        </div>

        {/* texto */}
        <span className="text-sm font-medium lp-text">
          {message}
        </span>

        {/* barra shimmer */}
        <div className="lp-bar" />
      </div>
    </>
  );
};

export default LoadingPulse;