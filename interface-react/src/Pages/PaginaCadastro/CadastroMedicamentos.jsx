import { useState } from "react";
import FormularioCadastro from "../../Componentes/FormularioCadastro";
import useMedicamentos from "../../Componentes/ListaDeMed";

const CadastroMedicamentos = () => {
    const [formData, setFormData] = useState({
        nome: "",
        principioAtivo: "",
        dosagem: "",
        usuarioId: "",
        observacoes: "",
        dependenteId: "",
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

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Se for "usoContinuo", convertemos para booleano
        if (name === "usoContinuo") {
            value = value === "true";
        }

        setFormData((prevState) => ({
            ...prevState,
            frequenciaUso:{
                ...prevState.frequenciaUso,
                [name]: value,
            }

        }));
    };


    const camposBase = [
        { type: "text", id: "nome-remedio", label: "Nome do Remédio:", name: "nome", placeholder: "Digite o nome do medicamento..." },
        { type: "text", id: "principioAtivo", label: "Princípio Ativo:", name: "principioAtivo", placeholder: "Digite o princípio ativo" },
        { type: "number", id: "dosagem", label: "Dosagem:", name: "dosagem", placeholder: "Dosagem..." },
        { type: "textarea", id: "observacoes", label: "Observações:", name: "observacoes" },

        {
            type: 'select', id: 'usoContinuo', label: 'Uso Contínuo?', name: 'usoContinuo',
            options: [
                { value: 'true', text: 'Selecione...' },
                { value: "true", text: 'Sim' },
                { value: "false", text: 'Não' }
            ],
            value: formData.frequenciaUso.usoContinuo === null ? "" : formData.frequenciaUso.usoContinuo.toString(),
            onChange: handleChange
        },

        {
            type: 'select', id: 'frequenciaUsoTipo', label: 'Tipo de Frequência', name: 'frequenciaUsoTipo',
            options: [
                { value: '', text: 'Selecione...' },
                { value: "HORARIOS_ESPECIFICOS", text: "Horário Específico"},
                { value: "INTERVALO_ENTRE_DOSES", text: 'Intervalo entre doses' }
            ],
            value: formData.frequenciaUso.frequenciaUsoTipo || "",
            onChange: handleChange
        }
    ];

    const camposExtras = [];
    if (formData.frequenciaUso.usoContinuo === false) {
            camposExtras.push({
                type: "date",
                id: `dataInicio`,
                label: `Data de Inicio:`,
                name: `dataInicio`,
                value: formData.frequenciaUso.dataInicio,
                onChange: handleChange
            },{ type: "date",
                id: "dataTermino",
                label: "Data de Término:",
                name: "dataTermino",
                value: formData.frequenciaUso.dataTermino,
                onChange: handleChange }
            );


    }
    if (formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS") {
        camposExtras.push({
            type: "time",
            id: "horariosEspecificos",
            label: "Horário:",
            name: "horariosEspecificos",
            value: formData.frequenciaUso.horariosEspecificos,
            onChange: handleChange
        });
    }

    if (formData.frequenciaUso.frequenciaUsoTipo === "INTERVALO_ENTRE_DOSES") {
        camposExtras.push({
            type: "time",
            id: "primeiroHorario",
            label: "Primeiro Horário:",
            name: "primeiroHorario",
            value: formData.frequenciaUso.primeiroHorario,
            onChange: handleChange
        });
        camposExtras.push({
            type: "number",
            id: "intervaloHoras",
            label: "Intervalo entre as doses (em horas):",
            name: "intervaloHoras",
            value: formData.frequenciaUso.intervaloHoras,
            onChange: handleChange
        });
    }



    const botao = [
        { label: "Salvar", type: "submit" },
        { label: "Voltar", destino: "/dashboard" }
    ];

    const { buscarAgenteAtivo } = useMedicamentos();

    const handleNomeChange = (e) => {
        const nome = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            nome,
            principioAtivo: buscarAgenteAtivo(nome)
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <FormularioCadastro
                campos={[...camposBase, ...camposExtras]}
                h1="Cadastro de Medicamento"
                botaos={botao}
                formData={formData}
                setFormData={setFormData}
                handleNomeChange={handleNomeChange}
                handleChange={handleChange}
            />
        </div>
    );
};

export default CadastroMedicamentos;
