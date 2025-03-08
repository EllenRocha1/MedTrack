import { Link } from "react-router-dom";
import { ClipboardList, Box, Bolt, Calendar, Home } from "lucide-react";

const ListaFuncionalidades = () => {
  return (
    <nav className="sm:p-2 text-white">
      <ul className="w-100 flex sm:flex-col space-y-4 sm:justify-start justify-center sm:gap-10 gap-[60px] md:space-y-0">
        <li className="pt-4">
          <Link to="/home" className=" flex items-center gap-2 hover:bg-gray-700 rounded">
            <Home size={30} />
            <span className="hidden sm:inline ml-2">HOME</span>
          </Link>
        </li>
        <li>
          <Link to="/lista_dependentes" className="flex items-center gap-2 hover:bg-gray-700 rounded">
            <ClipboardList size={30} />
            <span className="hidden sm:inline ml-2">LISTA DE DEPENDENTES</span>
          </Link>
        </li>
        <li>
          <Link to="/relatorios" className="flex items-center gap-2 hover:bg-gray-700 rounded">
            <Box size={30}  />
            <span className="hidden sm:inline ml-2">RELATÓRIOS</span>
          </Link>
        </li>
        <li>
          <Link to="/configuracoes" className="flex items-center gap-2 hover:bg-gray-700 rounded">
            <Bolt size={30}  />
            <span className="hidden sm:inline ml-2">CONFIGURAÇÕES</span>
          </Link>
        </li>
        <li>
          <Link to="/consultas" className="flex items-center gap-2 hover:bg-gray-700 rounded">
            <Calendar size={30}  />
            <span className="hidden sm:inline ml-2">LOGOUT</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ListaFuncionalidades;
