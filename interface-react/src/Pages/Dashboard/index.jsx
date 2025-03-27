import Sidebar from "../../Componentes/Sidebar";
import { getUserRole, getUserInfo } from "../../Componentes/Auth/AuthToken";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Header from "../../Componentes/Header";
import Botao from "../../Componentes/Botao";
import CardDependente from "../../Componentes/Card/CardDependente";

const Dashboard = () => {
  const userInfo = getUserInfo();
  const userRole = getUserRole();
  const isAdmin = userRole === "ADMINISTRADOR";
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [sidebarExpandida, setSidebarExpandida] = useState(true);

  const [dadosGrafico, setDadosGrafico] = useState({
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        label: "Adesão (%)",
        data: [90, 85, 88, 70, 75, 95, 100],
        backgroundColor: "rgba(34, 202, 236, 0.6)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: dadosGrafico,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      chartInstance.current.destroy();
    };
  }, [dadosGrafico]);

  return (
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar
            className="h-full"
            type={isAdmin}
            usuarioId={getUserInfo().id}
            expandida={sidebarExpandida}
            setExpandida={setSidebarExpandida}
        />

        <div className={`flex-1 flex flex-col h-full overflow-auto transition-all duration-300 ${
            sidebarExpandida ? "ml-0" : "ml-16" // Ajuste esses valores conforme a largura da sua sidebar
        }`}>
          <header className="text-2xl font-bold text-cyan-500 p-4">MedTrack</header>

          <main className="flex-1 p-4 bg-gray-100">
            <div className="bg-white p-5 rounded-lg shadow-md mb-5">
              <h1 className="text-2xl font-bold text-gray-800">
                👋 Olá, {userInfo.nome}!
              </h1>
              <p className="text-gray-600">Aqui está um resumo da sua medicação.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white shadow-md p-5 rounded-lg">
                <h2 className="text-xl font-semibold">💊 Medicamentos Ativos</h2>
                <p className="text-3xl font-bold text-blue-600">8</p>
              </div>

              <div className="bg-white shadow-md p-5 rounded-lg">
                <h2 className="text-xl font-semibold">⏰ Doses Tomadas Hoje</h2>
                <p className="text-3xl font-bold text-green-600">5 / 7</p>
              </div>

              <div className="bg-white shadow-md p-5 rounded-lg">
                <h2 className="text-xl font-semibold">⚠️ Doses Perdidas</h2>
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
            </div>

            {/* Gráfico de Adesão */}
            <div className="bg-white shadow-md p-5 rounded-lg mt-6">
              <h2 className="text-xl font-semibold mb-3">📊 Adesão aos Medicamentos</h2>
              <div className="h-40">
                <canvas ref={chartRef} style={{height: "160px"}}></canvas>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Dashboard;