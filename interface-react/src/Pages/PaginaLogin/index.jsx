import { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Service/auth';

const PaginaLogin = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const camposCadastro = [
        {
            type: "text",
            id: "nome-usuario",
            label: "Nome de Usuário: ",
            name: "username",
            placeholder: "Digite seu nome de usuário",
        },
        {
            type: "password",
            id: "senha",
            label: "Senha: ",
            name: "password",
            placeholder: "Digite sua senha",
        },
    ];

    const botaos = [
        { label: "Entrar", type: "submit" }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Dados enviados:", formData);

        try {
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setErro("Usuário ou senha incorretos. Tente novamente.");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center w-full text-center">
            <FormularioCadastro
                h1={"Login"}
                campos={camposCadastro}
                botaos={botaos}
                onSubmit={handleLogin}
                formData={formData}
                handleChange={handleChange}
            />
            {erro && <p className="text-red-500 mt-4">{erro}</p>}
        </div>
    );
};

export default PaginaLogin;