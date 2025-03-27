import {useState, useMemo, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import api from "../../Service/api";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";
import useMedicamentos from "../../Componentes/ListaDeMed";

const CadastroMedicamentos = () => {
    const userRole = getUserRole();
    const [dependentes, setDependentes] = useState([]);
    const [error, setError] = useState(null);
    const { buscarAgenteAtivo, filtrarMedicamentos } = useMedicamentos();
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        principioAtivo: "",
        dosagemQuantidade: "",
        dosagemUnidade: "mg",
        observacoes: "",
        frequenciaUso: {
            frequenciaUsoTipo: "",
            usoContinuo: null,
            intervaloHoras: 0,
            horariosEspecificos: [],
            primeiroHorario: "",
            dataInicio: "",
            dataTermino: ""
        },
    });

    const unidadesMedida = [
        { value: "mg", text: "mg" },
        { value: "g", text: "g" },
        { value: "ml", text: "ml" },
        { value: "L", text: "L" },
        { value: "mcg", text: "mcg" },
        { value: "cápsula(s)", text: "cápsula(s)" },
        { value: "comprimido(s)", text: "comprimido(s)" },
        { value: "gotas", text: "gotas" },
        { value: "UI", text: "UI" },
    ];

    const usuarioId = getUserInfo().id;
    const {dependenteId} = useParams();

    const handleSelecionarMedicamento = (nomeMedicamento) => {
        setFormData(prev => ({
            ...prev,
            nome: nomeMedicamento,
            principioAtivo: buscarAgenteAtivo(nomeMedicamento) || ""
        }));
        setMostrarSugestoes(false);
    };

    useEffect(() => {
        if (userRole === "ADMINISTRADOR") {
            const fetchDependentes = async () => {
                try {
                    const data = await api.get("http://localhost:8081/dependentes/buscar/todos");
                    setDependentes(data.data);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchDependentes();
        }
        else if (userRole === "PESSOAL") {
            const fetchMedicamentoPessoal = async () => {
                try {
                    const response = await api.get(`http://localhost:8081/usuarios/buscar/${usuarioId}`);
                    setDependentes(response.data);
                } catch (error) {
                    setError(error.message);
                }
            };
            fetchMedicamentoPessoal();
        }
    }, [userRole]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const isFrequenciaUsoField = Object.keys(formData.frequenciaUso).includes(name);

        if (name === "nome") {
            setFormData(prev => ({ ...prev, [name]: value }));

            if (value.length > 2) {
                const resultados = filtrarMedicamentos(value);
                setSugestoes(resultados);
                setMostrarSugestoes(resultados.length > 0);
            } else {
                setMostrarSugestoes(false);
            }
        } else {
            setFormData(prevState => {
                if (isFrequenciaUsoField) {
                    return {
                        ...prevState,
                        frequenciaUso: {
                            ...prevState.frequenciaUso,
                            [name]: name === "usoContinuo" ? value === "true" : type === "checkbox" ? checked : value,
                        },
                    };
                } else {
                    return {
                        ...prevState,
                        [name]: type === "checkbox" ? checked : value,
                    };
                }
            });
        }
    };

    const adicionarHorario = () => {
        if (formData.frequenciaUso.primeiroHorario) {
            setFormData(prevState => ({
                ...prevState,
                frequenciaUso: {
                    ...prevState.frequenciaUso,
                    horariosEspecificos: [
                        ...prevState.frequenciaUso.horariosEspecificos,
                        prevState.frequenciaUso.primeiroHorario
                    ],
                    primeiroHorario: "",
                }
            }));
        } else {
            alert('Por favor, insira um horário antes de adicionar.');
        }
    };

    const removerHorario = (index) => {
        setFormData(prevState => ({
            ...prevState,
            frequenciaUso: {
                ...prevState.frequenciaUso,
                horariosEspecificos: prevState.frequenciaUso.horariosEspecificos.filter((_, i) => i !== index)
            }
        }));
    };

    const camposBase = [
        {
            type: "text",
            id: "nome",
            label: "Nome do Remédio:",
            name: "nome",
            placeholder: "Digite o nome do medicamento..."
        },
        {
            type: "text",
            id: "principioAtivo",
            label: "Princípio Ativo:",
            name: "principioAtivo",
            placeholder: "Digite o princípio ativo"
        },
        {
            type: "dosagem",
            id: "dosagem",
            label: "Dosagem:",
            name: "dosagem",
            quantidadeName: "dosagemQuantidade",
            unidadeName: "dosagemUnidade",
            unidades: unidadesMedida,
            placeholder: "Dosagem..."
        },
        {
            type: "textarea",
            id: "observacoes",
            label: "Observações:",
            name: "observacoes"
        },
        {
            type: "select",
            id: "usoContinuo",
            label: "Uso Contínuo?",
            name: "usoContinuo",
            options: [
                { value: "", text: "Selecione..." },
                { value: true, text: "Sim" },
                { value: false, text: "Não" }
            ]
        },
        {
            type: "select",
            id: "frequenciaUsoTipo",
            label: "Tipo de Frequência",
            name: "frequenciaUsoTipo",
            options: [
                { value: "", text: "Selecione..." },
                { value: "HORARIOS_ESPECIFICOS", text: "Horário Específico" },
                { value: "INTERVALO_ENTRE_DOSES", text: "Intervalo entre doses" }
            ]
        }
    ];

    const camposExtras = useMemo(() => {
        let extras = [];

        if(formData.frequenciaUso.usoContinuo === true) {
            formData.frequenciaUso.frequenciaUsoTipo = "HORARIOS_ESPECIFICOS";
        }

        if (formData.frequenciaUso.usoContinuo === false) {
            extras.push(
                { type: "date", id: "dataInicio", label: "Data de Início:", name: "dataInicio" },
                { type: "date", id: "dataTermino", label: "Data de Término:", name: "dataTermino" }
            );
        }

        if (formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS") {
            extras.push({
                type: "time",
                id: "primeiroHorario",
                label: "Adicionar Horário:",
                name: "primeiroHorario",
                value: formData.frequenciaUso.primeiroHorario || "",
                onChange: handleChange
            });
        }

        if (formData.frequenciaUso.frequenciaUsoTipo === "INTERVALO_ENTRE_DOSES") {
            extras.push(
                { type: "time", id: "primeiroHorario", label: "Primeiro Horário:", name: "primeiroHorario" },
                { type: "number", id: "intervaloHoras", label: "Intervalo entre as doses (em horas):", name: "intervaloHoras" }
            );
        }

        return extras;
    }, [formData.frequenciaUso]);

    const getDadosCadastro = (userRole) => {
        const dadosBase = {
            nome: formData.nome,
            principioAtivo: formData.principioAtivo,
            dosagem: `${formData.dosagemQuantidade}${formData.dosagemUnidade}`,
            observacoes: formData.observacoes,
            usuarioId: usuarioId,
            frequenciaUso: {
                frequenciaUsoTipo: formData.frequenciaUso.frequenciaUsoTipo,
                usoContinuo: formData.frequenciaUso.usoContinuo,
                intervaloHoras: formData.frequenciaUso.intervaloHoras,
                horariosEspecificos: formData.frequenciaUso.horariosEspecificos,
                primeiroHorario: formData.frequenciaUso.primeiroHorario,
                dataInicio: formData.frequenciaUso.dataInicio,
                dataTermino: formData.frequenciaUso.dataTermino
            },
        };

        return userRole === "ADMINISTRADOR"
            ? { ...dadosBase, dependenteId }
            : dadosBase;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.principioAtivo || !formData.dosagemQuantidade || !formData.dosagemUnidade) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await api.post("http://localhost:8081/medicamentos/cadastro", getDadosCadastro(userRole));
            if (response) {
                const redirectPath = userRole === "ADMINISTRADOR"
                    ? `/perfil_dependente/${dependenteId}`
                    : `/perfil_usuario/${usuarioId}`;
                navigate(redirectPath);
            }
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error);
            alert('Erro ao cadastrar medicamento. Verifique sua conexão ou tente novamente mais tarde.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Cadastro de Medicamento</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="flex flex-col gap-4">
                    {[...camposBase, ...camposExtras].map((campo) => (
                        <div key={campo.id} className="flex flex-col relative">
                            <label className="text-left text-gray-700 font-medium" htmlFor={campo.id}>
                                {campo.label}
                            </label>

                            {campo.id === "nome" ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        id={campo.id}
                                        name={campo.name}
                                        value={formData[campo.name] || ""}
                                        onChange={handleChange}
                                        className="border p-2 border-blue-400 rounded-lg w-full"
                                        placeholder={campo.placeholder}
                                        autoComplete="off"
                                    />
                                    {mostrarSugestoes && (
                                        <ul className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                            {sugestoes.map((nome, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-blue-50 cursor-pointer"
                                                    onClick={() => handleSelecionarMedicamento(nome)}
                                                >
                                                    {nome}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : campo.type === "select" ? (
                                <select
                                    id={campo.id}
                                    name={campo.name}
                                    value={
                                        campo.name in formData.frequenciaUso
                                            ? formData.frequenciaUso[campo.name] || ""
                                            : formData[campo.name] || ""
                                    }
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                >
                                    {campo.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.text}
                                        </option>
                                    ))}
                                </select>
                            ) : campo.type === "dosagem" ? (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id={`${campo.id}-quantidade`}
                                        name={campo.quantidadeName}
                                        value={formData[campo.quantidadeName] || ""}
                                        onChange={handleChange}
                                        className="border p-2 border-blue-400 rounded-lg flex-1"
                                        placeholder="Quantidade"
                                        step="any"
                                    />
                                    <select
                                        id={`${campo.id}-unidade`}
                                        name={campo.unidadeName}
                                        value={formData[campo.unidadeName] || ""}
                                        onChange={handleChange}
                                        className="border p-2 border-blue-400 rounded-lg"
                                    >
                                        {campo.unidades.map((unidade) => (
                                            <option key={unidade.value} value={unidade.value}>
                                                {unidade.text}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : campo.type === "textarea" ? (
                                <textarea
                                    id={campo.id}
                                    name={campo.name}
                                    value={formData[campo.name] || ""}
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                    placeholder={campo.placeholder}
                                />
                            ) : (
                                <input
                                    type={campo.type}
                                    id={campo.id}
                                    name={campo.name}
                                    value={
                                        campo.name in formData.frequenciaUso
                                            ? formData.frequenciaUso[campo.name] || ""
                                            : formData[campo.name] || ""
                                    }
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                    placeholder={campo.placeholder}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS" && (
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            type="button"
                            onClick={adicionarHorario}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Adicionar Horário
                        </button>
                    </div>
                )}

                {formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS" &&
                    formData.frequenciaUso.horariosEspecificos.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Horários Adicionados:</h3>
                            <ul className="list-disc list-inside">
                                {formData.frequenciaUso.horariosEspecificos.map((horario, index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        <span>{horario}</span>
                                        <button
                                            type="button"
                                            onClick={() => removerHorario(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remover
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Salvar
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CadastroMedicamentos;