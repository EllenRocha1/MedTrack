import Sidebar from "../../Componentes/Sidebar"
import {getUserRole, getUserInfo} from "../../Componentes/Auth/AuthToken.js";


const Dashboard = () =>{
  const role = getUserRole()
  let type = true
  if (role === "PESSOAL") {
    type = false;
  }


    return(
        <div className="flex h-screen bg-gray-100">
      
      <Sidebar type={type} usuarioId={getUserInfo().id} />
      <main className="flex-1 p-5">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <div className="grid grid-cols-3 gap-5 mt-5">
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h2 className="text-xl font-semibold">👥 Usuários Cadastrados</h2>
            <p className="text-3xl font-bold text-blue-600">1.245</p>
          </div>

          <div className="bg-white shadow-md p-5 rounded-lg">
            <h2 className="text-xl font-semibold">📈 Vendas Mensais</h2>
            <p className="text-3xl font-bold text-green-600">R$ 35.600</p>
          </div>

          <div className="bg-white shadow-md p-5 rounded-lg">
            <h2 className="text-xl font-semibold">📩 Mensagens Pendentes</h2>
            <p className="text-3xl font-bold text-red-600">17</p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard