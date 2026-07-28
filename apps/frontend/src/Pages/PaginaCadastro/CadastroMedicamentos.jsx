import {useState, useMemo, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import api, { BACKEND_URL } from "../../Service/api";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";
import useMedicamentos from "../../Componentes/ListaDeMed";
import { FiAlertTriangle, FiCheckCircle, FiImage, FiUpload, FiX } from "react-icons/fi";
import Loading from "../../Componentes/Loading";
import Popup from "../../Componentes/PopUp";

const CadastroMedicamentos = () => {
    const userRole = getUserRole();
    const [dependentes, setDependentes] = useState([]);
    const [error, setError] = useState(null);
    const { buscarAgenteAtivo, filtrarMedicamentos } = useMedicamentos();
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [duplicidade, setDuplicidade] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupTexto, setPopupTexto] = useState({ h2: "", sub: "" });
    
    const [formData, setFormData] = useState({
        nome: "",
        principioAtivo: "",
        dosagemQuantidade: "",
        dosagemUnidade: "mg",
        observacoes: "",
        imagemArquivo: null,
        estoque: {
            quantidadeAtual: "",
            quantidadeMinima: ""
        },
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
        const fetchInitialData = async () => {
            try {
                if (userRole === "ADMINISTRADOR") {
                    const data = await api.get(`${BACKEND_URL}/dependentes/buscar/todos`);
                    setDependentes(data.data);
                }
                else if (userRole === "PESSOAL") {
                    const response = await api.get(`${BACKEND_URL}/usuarios/buscar/${usuarioId}`);
                    setDependentes(response.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (userRole) {
            fetchInitialData();
        }
    }, [userRole, usuarioId]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        const isFrequenciaUsoField = Object.keys(formData.frequenciaUso).includes(name);
        const isEstoqueField = Object.keys(formData.estoque).includes(name);

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
                } else if (isEstoqueField) {
                    return {
                        ...prevState,
                        estoque: {
                            ...prevState.estoque,
                            [name]: value
                        }
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
            setPopupTexto({
                h2: "Horário Inválido",
                sub: "Por favor, insira um horário antes de adicionar."
            });
            setPopupOpen(true);
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
            label: "Dosagem da Embalagem (ex: 500mg):",
            name: "dosagem",
            quantidadeName: "dosagemQuantidade",
            unidadeName: "dosagemUnidade",
            unidades: unidadesMedida,
            placeholder: "Dosagem..."
        },
        
        {
            type: "number",
            id: "quantidadeAtual",
            label: "Quantas unidades (comprimidos/frascos) você tem agora?",
            name: "quantidadeAtual",
            placeholder: "Ex: 30"
        },
        {
            type: "number",
            id: "quantidadeMinima",
            label: "Avisar de estoque baixo quando chegar em:",
            name: "quantidadeMinima",
            placeholder: "Ex: 5"
        },
        {
            type: "textarea",
            id: "observacoes",
            label: "Observações:",
            name: "observacoes"
        },
        {
            type: "file",
            id: "imagemArquivo",
            label: "Imagem do Medicamento:",
            name: "imagemArquivo",
            accept: "image/png,image/jpeg"
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

    const getDadosCadastro = (userRole, opcoes = {}) => {
        const temEstoque = formData.estoque.quantidadeAtual !== "";
        const dadosEstoque = temEstoque ? {
            quantidadeAtual: Number(formData.estoque.quantidadeAtual),
            quantidadeMinima: formData.estoque.quantidadeMinima !== "" ? Number(formData.estoque.quantidadeMinima) : 0
        } : null;

        const dadosBase = {
            nome: formData.nome,
            principioAtivo: formData.principioAtivo,
            dosagem: `${formData.dosagemQuantidade}${formData.dosagemUnidade}`,
            observacoes: formData.observacoes,
            usuarioId: usuarioId,
            estoque: dadosEstoque,
            ignorarDuplicidade: opcoes.ignorarDuplicidade || false,
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

    const cadastrarMedicamento = async ({ ignorarDuplicidade = false } = {}) => {
        if (!formData.nome || !formData.principioAtivo || !formData.dosagemQuantidade || !formData.dosagemUnidade) {
            setPopupTexto({
                h2: "Campos Obrigatórios",
                sub: "Por favor, preencha todos os campos obrigatórios."
            });
            setPopupOpen(true);
            return;
        }

        setSalvando(true);

        try {
            const response = await api.post(
                `${BACKEND_URL}/medicamentos/cadastro`,
                getDadosCadastro(userRole, { ignorarDuplicidade })
            );
            if (response) {
                if (formData.imagemArquivo && response.id) {
                    const dadosImagem = new FormData();
                    dadosImagem.append("imagem", formData.imagemArquivo);
                    await api.postForm(`${BACKEND_URL}/medicamentos/${response.id}/imagem`, dadosImagem);
                }

                const redirectPath = userRole === "ADMINISTRADOR"
                    ? `/perfil_dependente/${dependenteId}`
                    : `/perfil_usuario/${usuarioId}`;
                navigate(redirectPath);
            }
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error);

            if (error.status === 409 && error.data?.duplicidade) {
                setDuplicidade(error.data);
                return;
            }

            setPopupTexto({
                h2: "Erro no Cadastro",
                sub: "Erro ao cadastrar medicamento. Verifique sua conexão ou tente novamente mais tarde."
            });
            setPopupOpen(true);
        } finally {
            setSalvando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await cadastrarMedicamento();
    };

    const continuarComDuplicidade = async () => {
        setDuplicidade(null);
        await cadastrarMedicamento({ ignorarDuplicidade: true });
    };

    const getValorCampo = (nomeCampo) => {
        if (nomeCampo in formData.frequenciaUso) return formData.frequenciaUso[nomeCampo] || "";
        if (nomeCampo in formData.estoque) return formData.estoque[nomeCampo] || "";
        return formData[nomeCampo] || "";
    };   

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading message={"Preparando formulário..."} color={"blue"} />
            </div>
        );
    }

    if (salvando) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading message={"Salvando medicamento..."} color={"green"} icon={"check"} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Popup
                open={popupOpen}
                setOpen={setPopupOpen}
                texto={popupTexto}
                botao1={{ label: "Entendido", funcao: () => setPopupOpen(false) }}
            />
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
                                    value={getValorCampo(campo.name)}
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
                                    value={getValorCampo(campo.name)}
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                    placeholder={campo.placeholder}
                                />
                            ) : campo.type === "file" ? (
                                <div>
                                    <input
                                        type="file"
                                        id={campo.id}
                                        name={campo.name}
                                        accept={campo.accept}
                                        onChange={(event) => setFormData(prev => ({
                                            ...prev,
                                            [campo.name]: event.target.files?.[0] || null
                                        }))}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor={campo.id}
                                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-blue-300 bg-blue-50 p-3 text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
                                    >
                                        <span className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-white text-blue-600 shadow-sm">
                                                <FiImage size={20} />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-semibold">
                                                    {formData[campo.name]?.name || "Selecionar imagem"}
                                                </span>
                                                <span className="block text-xs text-blue-500">
                                                    PNG ou JPEG
                                                </span>
                                            </span>
                                        </span>
                                        <FiUpload className="flex-shrink-0" size={20} />
                                    </label>
                                </div>
                            ) : (
                                <input
                                    type={campo.type}
                                    id={campo.id}
                                    name={campo.name}
                                    value={getValorCampo(campo.name)}
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
                        disabled={salvando}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {salvando ? "Salvando..." : "Salvar"}
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

            {duplicidade && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <FiAlertTriangle size={24} />
                            </span>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Possível duplicidade de princípio ativo
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    {duplicidade.mensagem}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-gray-700">
                                Medicamento já cadastrado:
                            </p>
                            <p className="mt-1 font-semibold text-gray-900">
                                {duplicidade.nomeMedicamentoExistente}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                Princípio ativo: {duplicidade.principioAtivoConflitante}
                            </p>
                        </div>

                        <p className="mt-4 text-sm text-gray-600">
                            Verifique se há risco de uso simultâneo antes de continuar.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDuplicidade(null)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                <FiX size={18} />
                                Cancelar cadastro
                            </button>
                            <button
                                type="button"
                                onClick={continuarComDuplicidade}
                                disabled={salvando}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
                            >
                                <FiCheckCircle size={18} />
                                Continuar mesmo assim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CadastroMedicamentos;