import Sidebar from "../../Componentes/Sidebar";
import { getUserInfo } from "../../Componentes/Auth/AuthToken";
import { useEffect, useState } from "react";
import api from "../../Service/api";
import { FiPackage, FiAlertTriangle } from "react-icons/fi";

const DashboardPessoal = () => {
  const userInfo = getUserInfo();
  const [sidebarExpandida, setSidebarExpandida] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api.get(`/dashboard/pessoal`);
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        type={false}
        usuarioId={userInfo.id}
        expandida={sidebarExpandida}
        setExpandida={setSidebarExpandida}
      />

      <div className={`flex-1 flex flex-col h-full overflow-auto transition-all duration-300 ${sidebarExpandida ? "ml-0" : "ml-16"}`}>
        <header className="p-6 bg-white border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-cyan-600">Meu Painel de Saúde</h2>
          <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full uppercase tracking-wider">Pessoal</span>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span>
        </header>

        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Olá, {userInfo.nome}!</h1>
            <p className="text-gray-500">Confira suas medicações e níveis de estoque.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl"><FiPackage /></div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Medicamentos Ativos</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData?.totalMedicamentos || 0}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-2xl"><FiAlertTriangle /></div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Reposições Urgentes</p>
                <p className="text-2xl font-bold text-amber-600">
                  {dashboardData?.estoqueCritico?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-inter">Próximas Tomadas</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border-l-4 border-cyan-500">
                  <span className="text-lg font-bold text-gray-700 w-16">08:00</span>
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-gray-800">Paracetamol</p>
                    <p className="text-xs text-gray-500">1 comprimido após o café</p>
                  </div>
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Confirmar</button>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Meu Estoque</h3>
                <button className="text-cyan-600 text-sm font-semibold hover:underline">Ver tudo</button>
              </div>

              <div className="space-y-4">
                {dashboardData?.estoqueCritico?.length > 0 ? (
                  dashboardData.estoqueCritico.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-red-50 border border-red-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-red-800">{item.nome}</p>
                          <p className="text-xs text-red-600">Restam apenas {item.quantidade} un.</p>
                        </div>
                        <div className="text-xs bg-white text-red-600 px-2 py-1 rounded-md border border-red-200 font-bold uppercase">Crítico</div>
                      </div>
                      <button className="w-full mt-3 py-2 bg-white text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                        Registrar Compra
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <FiPackage className="mx-auto text-3xl mb-2 opacity-20" />
                    <p className="text-sm">Tudo em dia com seu estoque!</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPessoal;