import { useState } from "react";
import Header from "../../Componentes/Header";
import { Bell } from "lucide-react";
import Perfil from "../../Componentes/Perfil";
import Medicacoes from "../../Componentes/Medicacoes/Medicacoes";

const PerfilDependente = () => {
    const [termoPesquisa, setTermoPesquisa] = useState(""); // Estado para a pesquisa
    const name = "Jaison";

    return (
        <div>
            <header className="flex items-center md:w-4/5 mx-auto md:pr-10">
                <Header h1={`Olá, ${name}`} exibirPesquisa={true} setTermoPesquisa={setTermoPesquisa} />
                <Bell size={40} color="cyan" className="hidden sm:block ml-auto" />
            </header>

            <main className="sm:flex 2xl:flex-col md:w-4/5 gap-5 justify-center mx-auto">
                <section className="mx-auto h-screen border border-cyan-300 rounded-lg p-10 ml-3 hidden sm:block">
                    <Perfil vaiTer={true} />
                </section>
                <section className="mx-auto w-full h-screen">
                    <Medicacoes termoPesquisa={termoPesquisa} />
                </section>
            </main>
        </div>
    );
};

export default PerfilDependente;
