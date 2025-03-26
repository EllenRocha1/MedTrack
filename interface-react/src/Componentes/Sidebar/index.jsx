import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Home, Menu, X, Box, Calendar, Bolt } from "lucide-react";
import Perfil from "../Perfil";
import ListaFuncionalidades from "../ListaFuncionalidades";
import { getUserInfo } from "../Auth/AuthToken";

export default function Sidebar({ type, usuarioId }) {
  const [expandida, setExpandida] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // Função para alternar a sidebar entre expandida e recolhida
  const toggleSidebar = () => {
    setExpandida(!expandida); // Alterna o estado da sidebar
  };

  // Carrega as informações do usuário
  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  if (!userInfo) {
    return <div>Carregando...</div>; // Exibe um carregamento até os dados do usuário estarem prontos
  }

  return (
      <>
        {/* Sidebar visível em telas grandes */}
        <div
            className={`bg-gray-800 text-white transition-all duration-300 sm:block hidden ${
                expandida ? "w-64" : "w-16"
            } h-screen flex-shrink-0`}
        >
          {/* Botão de abrir/fechar sidebar */}
          <button
              onClick={toggleSidebar}
              className="p-3 bg-gray-800 text-white rounded-md fixed top-2 left-2 z-50"
          >
            {expandida ? (
                <X /> // Ícone para fechar
            ) : (
                <Menu /> // Ícone para abrir
            )}
          </button>

          {/* Sidebar com animação para expandir/recolher */}
          <motion.div
              initial={{ x: -300 }}
              animate={{ x: expandida ? 0 : -300 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gray-900 text-white p-5 shadow-lg"
          >
            <Perfil userInfo={userInfo} />
            <ListaFuncionalidades type={type} usuarioId={usuarioId} />
          </motion.div>
        </div>

        {/* Sidebar visível em telas pequenas (mobile) */}
        <div className="fixed flex space-between bottom-0 left-0 w-full bg-gray-900 text-white justify-around items-center p-3 sm:hidden">
          <ListaFuncionalidades type={type} usuarioId={usuarioId} />
        </div>
      </>
  );
}
