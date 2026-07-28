import Sidebar from "../../Componentes/Sidebar";
import { getUserInfo } from "../../Componentes/Auth/AuthToken";
import { useEffect, useState } from "react";
import api, { BACKEND_URL } from "../../Service/api";
import { FiPackage, FiAlertTriangle, FiClock } from "react-icons/fi";
import Loading from "../../Componentes/Loading";
import Popup from "../../Componentes/PopUp";

const DashboardPessoal = () => {
  const userInfo = getUserInfo();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTexto, setPopupTexto] = useState({ h2: "", sub: "" });

  const fetchDashboard = async () => {
    try {
      const usuarioId = userInfo.id;
      const response = await api.get(`${BACKEND_URL}/medicamentos/dashboard/resumo/${usuarioId}`);
      setDashboardData(response.data ? response.data : response);
    } catch (error) {
      console.error("Erro ao buscar o dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarDose = async (medicamentoId) => {
    try {
      await api.patch(`${BACKEND_URL}/medicamentos/${medicamentoId}/consumir`);
      fetchDashboard();
    } catch (error) {
      console.error("Erro ao confirmar dose:", error);
      setPopupTexto({
        h2: "Erro ao confirmar dose",
        sub: "Não foi possível confirmar a dose. Verifique se este medicamento tem um estoque configurado."
      });
      setPopupOpen(true);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchDashboard();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading message={"Carregando painel..."} color={"teal"} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Popup
        open={popupOpen}
        setOpen={setPopupOpen}
        texto={popupTexto}
        botao1={{ label: "Entendido", funcao: () => setPopupOpen(false) }}
      />
      
      <Sidebar type={false} />

      <div className="flex-1 flex flex-col h-full overflow-auto transition-all duration-300">
        <header className="p-6 bg-white border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-cyan-600">Meu Painel de Saúde</h2>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span>
        </header>

        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Olá, {userInfo?.nome || 'Usuário'}!</h1>
            <p className="text-gray-500">Confira suas medicações e níveis de estoque.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-2xl"><FiPackage /></div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Medicamentos Ativos</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData?.medicamentosAtivos || 0}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-2xl"><FiAlertTriangle /></div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Reposições Urgentes</p>
                <p className="text-2xl font-bold text-amber-600">{dashboardData?.reposicoesUrgentes || 0}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg text-2xl"><FiClock /></div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Próximas Doses</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.proximasDoses || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-inter">Próximas Doses</h3>
              <div className="space-y-4">
                {dashboardData?.listaMedicamentosHoje?.length > 0 ? (
                  dashboardData.listaMedicamentosHoje.map((medicamento) => (
                    <div key={medicamento.id} className="flex items-center p-4 bg-gray-50 rounded-xl border-l-4 border-cyan-500">
                      <span className="text-lg font-bold text-gray-700 w-16">Hoje</span>
                      <div className="ml-4 flex-1">
                        <p className="font-bold text-gray-800">{medicamento.nome}</p>
                        <p className="text-xs text-gray-500">{medicamento.dosagem}</p>
                      </div>
                      <button
                        onClick={() => handleConfirmarDose(medicamento.id)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Confirmar
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm">Nenhuma dose programada para hoje.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Meu Estoque</h3>
              </div>
              <div className="space-y-4">
                {dashboardData?.listaMedicamentosHoje?.length > 0 ? (
                  dashboardData.listaMedicamentosHoje.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-blue-800">{item.nome}</p>
                          <p className="text-xs text-blue-600">Restam: {item.estoque?.quantidadeAtual || 0} un.</p>
                        </div>
                        {item.estoque?.quantidadeAtual <= item.estoque?.quantidadeMinima && (
                          <div className="text-xs bg-white text-red-600 px-2 py-1 rounded-md border border-red-200 font-bold uppercase">
                            Crítico
                          </div>
                        )}
                      </div>
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