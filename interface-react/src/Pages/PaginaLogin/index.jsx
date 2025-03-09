import { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import { useNavigate } from 'react-router-dom';

const PaginaLogin = () => {
    const [formData, setFormData] = useState({ username: "", password: "" }); // Estado para armazenar os dados do formulário
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const camposCadastro = [
        { type: "text",
            id: "nome-usuario",
            label: "Nome de Usuário: ",
            name: "username",
            placeholder: "Digite seu nome de usuário",
            value: formData.username,
            onChange: (e) => {
                console.log("Digitando usuário:", e.target.value);
                setFormData({ ...formData, username: e.target.value });
            }
        },
        { type: "password",
            id: "senha",
            label: "Senha: ",
            name: "password",
            placeholder: "Digite sua senha",
            value: formData.password,
            onChange: (e) => {
                console.log("Digitando senha:", e.target.value);
                setFormData({ ...formData, password: e.target.value });
            }
        },
    ];

    const botaos = [
        { label: "Entrar" }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Dados enviados:", formData);

        try {
            const response = await fetch('http://localhost:8081/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log("Resposta da API:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Json recebido:", data);

                localStorage.setItem('token', data.token);

                navigate('/dashboard');
            } else {
                const errorText = await response.json();
                console.error("Erro do backend:", errorText);

                // Exibir mensagem de erro para o usuário
                setErro(errorText || "Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao conectar com o servidor. Verifique sua conexão ou tente novamente mais tarde.");
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
            {erro && <p className="text-red-500 mt-4">{erro}</p>} {/* Exibir mensagem de erro */}
        </div>
    );
};

export default PaginaLogin;