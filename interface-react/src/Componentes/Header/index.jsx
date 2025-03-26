import Botao from '../Botao/index.jsx';
import { Search } from 'lucide-react';

const Header = ({ exibirPesquisa, h1, setTermoPesquisa }) => {
    return (
        <header className="flex items-center gap-2 justify-between w-full md:px-10 sm:px-6 px-4 py-4 ">

            <h1 className="text-2xl font-bold text-cyan-500">{h1}</h1>
            <div className="flex gap-6 ">
                {exibirPesquisa ? (
                    <div className='flex px-2 items-center border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                        <Search color='turquoise' />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="px-4 py-2 m-auto border-none focus:outline-none"
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="flex gap-4 items-center ">
                        <nav className="hidden md:flex gap-6 text-gray-700">
                            <a href="#" className="hover:text-cyan-500">Home</a>
                            <a href="#" className="hover:text-cyan-500">Contato</a>
                            <a href="#" className="hover:text-cyan-500">Sobre</a>
                            <a href="#" className="hover:text-cyan-500">Blog</a>
                        </nav>
                        <Botao label="Sign-Up" destino="/cadastro" />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;