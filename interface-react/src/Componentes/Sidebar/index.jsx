import {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { ClipboardList, Home, Menu, X, Box, Calendar, Bolt} from "lucide-react";
import Perfil from "../Perfil";
import ListaFuncionalidades from "../ListaFuncionalidades";
import {getUserInfo} from "../Auth/AuthToken";

export default function Sidebar({type, usuarioId}) {
  const [expandida, setExpandida] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  if (!userInfo) {
    return <div>Carregando...</div>;
  }
  return (
    <>
    <div className={`bg-gray-800 text-white transition-all duration-300 sm:block hidden ${
        expandida ? "w-64" : "w-16"
      } h-screen flex-shrink-0`}
    >
      {/* Botão de abrir/fechar */}
      <button
        onClick={() => setExpandida(!expandida)}
        className="p-3 bg-gray-800 text-white rounded-md fixed top-2 left-2 z-50"
      >
        {expandida ? <X /> : <div className="flex flex-col gap-[150px] ">
                                  <Menu />
                                    <div className="flex flex-col gap-[50px]">
                                    <Home/>
                                      <ClipboardList/>
                                        <Box/>
                                        <Bolt/>
                                          <Calendar/>
                                          </div>
                                        </div>}
      </button>

      {/* Sidebar animada */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: expandida ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={` left-0 top-0 h-full w-64 bg-gray-900 text-white p-5 shadow-lg `}
      >
        <Perfil userInfo={userInfo} />
        <ListaFuncionalidades type={type} usuarioId={usuarioId} />
      </motion.div>
      </div>

      <div className="fixed flex space-between bottom-0 left-0 w-full bg-gray-900 text-white justify-around items-center p-3 sm:hidden">
          <ListaFuncionalidades type={type} usuarioId={usuarioId}/>
      </div>
    </>
  );
}
