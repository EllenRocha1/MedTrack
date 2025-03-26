import {useEffect, useState} from "react";
import Sidebar from "../../Componentes/Sidebar";
import { getUserInfo, getUserRole } from "../../Componentes/Auth/AuthToken";
import api from "../../Service/api";
import {useNavigate} from "react-router-dom";

const Configuracoes = () => {
    const [abaAtiva, setAbaAtiva] = useState("perfil");
    const role = getUserRole();
    const [data, setData] = useState("")
    const [usuario, setUsuario] = useState("")
    const [error, setError] = useState(null)
    const isAdmin = role === "ADMINISTRADOR";
    const usuarioId = getUserInfo().id

    useEffect(() => {
        const getUsuario = async ()=>{
            try {
                const response = await api.get(`http://localhost:8081/usuarios/buscar/${usuarioId}`);
                console.log("Dados recebidos USuea:", response);
                setUsuario(response);
            } catch (err) {
                setError(err.message);
            }
        }
        getUsuario()
    }, []);

    useEffect(() => {
        const fetchDependentes = async () => {
            if (role === "ADMINISTRADOR") {
                try {
                    const data = await api.get("http://localhost:8081/dependentes/buscar/todos");
                    console.log("Dados recebidos:", data);
                    setData(data);
                } catch (err) {
                    setError(err.message);
                }
            }
        }
        fetchDependentes();

    }, [role]);
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar type={isAdmin} usuarioId={getUserInfo().id} />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Configurações</h1>
                <div className="flex gap-4 border-b pb-2 mb-4">

                    <button
                        onClick={() => setAbaAtiva("perfil")}
                        className={`px-4 py-2 text-lg font-medium border-b-2 transition-colors ${
                            abaAtiva === "perfil" ? "border-cyan-500 text-cyan-500" : "border-transparent hover:text-gray-600"
                        }`}
                    >
                        Editar Perfil
                    </button>


                    {isAdmin && (
                        <button
                            onClick={() => setAbaAtiva("dependentes")}
                            className={`px-4 py-2 text-lg font-medium border-b-2 transition-colors ${
                                abaAtiva === "dependentes" ? "border-cyan-500 text-cyan-500" : "border-transparent hover:text-gray-600"
                            }`}
                        >
                            Dependentes
                        </button>
                    )}
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-md">
                    {abaAtiva === "perfil" && <Perfil usuarioInicial={usuario}/>}
                    {abaAtiva === "dependentes" && isAdmin && <Dependentes dependentes={data}/>}
                </div>
            </div>
        </div>
    );
};

const Perfil = ({ usuarioInicial }) => {
    const [usuario, setUsuario] = useState(usuarioInicial || {});
    const [erro, setError] = useState(null);

    useEffect(() => {
        if (usuarioInicial) {
            setUsuario(usuarioInicial);
        }
    }, [usuarioInicial]);

    const handleAlteracoes = async () => {
        if (!usuario?.id) {
            setError("Não conseguimos encontrar o Usuário");
            return;
        }

        try {
            const response = await api.put(
                `http://localhost:8081/usuarios/atualizar/${usuario.id}`,
                usuario
            );
            console.log("Dados atualizados:", response);
            setUsuario(response);
            setError(null);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };
    const navigate = useNavigate()
    const handleDelete = async () => {
        if (!usuario?.id) {
            setError("Não conseguimos encontrar o Usuário");
            return;
        }

        try {
            await api.delete(`http://localhost:8081/usuarios/deletar/${usuario.id}`);
            console.log("Conta excluída com sucesso!");
            setUsuario({});
            setError(null);
            navigate("/")
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold">Perfil do Usuário</h2>
            <p className="text-gray-600 mb-2">Atualize suas informações.</p>

            {erro && <p className="text-red-500">{erro}</p>}
            <label>Nome</label>
            <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Nome do Usuário"
                value={usuario?.nome || ""}
                onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
            />
            <label>Email </label>
            <input
                className="border p-2 w-full mb-2"
                type="email"
                placeholder="E-mail"
                value={usuario?.email || ""}
                onChange={(e) => setUsuario({...usuario, email: e.target.value})}
            />
            <label>Número de Telefone </label>
            <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Telefone"
                value={usuario?.numeroTelefone || ""}
                onChange={(e) => setUsuario({...usuario, telefone: e.target.value})}
            />
            <label>Nome de Usuário </label>
            <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Nome de Usuário"
                value={usuario?.nomeUsuario || ""}
                onChange={(e) => setUsuario({...usuario, nomeUsuario: e.target.value})}
            />

            <button
                className="bg-cyan-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleAlteracoes}
            >
                Salvar Alterações
            </button>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
                onClick={handleDelete}
            >
                Excluir Conta
            </button>
        </div>
    );
};


const Dependentes = ({dependentes}) => {
    const [dependenteSelecionado, setDependenteSelecionado] = useState(null);
    const [error, setError] = useState(null)
    const handleChange = (event) => {
        const depSelecionado = dependentes.find(dep => dep.nomeUsuario === event.target.value);
        setDependenteSelecionado(depSelecionado || {});
    };
    const handleAlteracoes = async () => {
        if (!dependenteSelecionado?.id) {
            setError("Nenhum dependente selecionado.");
            return;
        }

        try {
            const response = await api.put(
                `http://localhost:8081/dependentes/atualizar/${dependenteSelecionado.id}`,
                dependenteSelecionado
            );
            console.log("Dados atualizados:", response.data);
            setDependenteSelecionado(response.data);
            setError(null);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div>
            <h2 className="text-xl font-semibold">Gerenciar Dependentes</h2>
            <p className="text-gray-600 mb-2">Adicione ou edite dependentes.</p>

            <select className="border p-2 w-full mb-2" onChange={handleChange}>
                <option value="">Selecione o Dependente</option>
                {dependentes.map((dep, index) => (
                    <option key={index} value={dep.nomeUsuario}>{dep.nomeUsuario}</option>
                ))}
            </select>
            <label>Nome do Dependente </label>
            <input

                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Nome do dependente:"
                value={dependenteSelecionado?.nome || ""}
                onChange={(e) => setDependenteSelecionado({...dependenteSelecionado, nome: e.target.value})}
            />
            <label>Email do Dependente </label>
            <input
                className="border p-2 w-full mb-2"
                type="email"
                placeholder="Email do dependente:"
                value={dependenteSelecionado?.email || ""}
                onChange={(e) => setDependenteSelecionado({...dependenteSelecionado, email: e.target.value})}
            />
            <label>Numero </label>
            <input
                className="border p-2 w-full mb-2"
                type="number"
                placeholder="Número:"
                value={dependenteSelecionado?.telefone || ""}
                onChange={(e) => setDependenteSelecionado({...dependenteSelecionado, telefone: e.target.value})}
            />
            <label>Nome de Usuario </label>
            <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Nome de Usuário:"
                value={dependenteSelecionado?.nomeUsuario || ""}
                onChange={(e) => setDependenteSelecionado({...dependenteSelecionado, nomeUsuario: e.target.value})}
            />

            <button className="bg-cyan-500 text-white px-4 py-2 rounded mt-2"
                    onClick={handleAlteracoes}>
                Salvar Alterações

            </button>
        </div>
    );
};

export default Configuracoes;
