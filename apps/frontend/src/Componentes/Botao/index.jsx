import { useNavigate } from "react-router-dom";

const Botao = ({ label, destino, estado, type = "button" }) => {
    const navegador = useNavigate();

    const handleClick = () => {
        if (destino) {
            navegador(destino, estado ? { state: estado } : undefined);
        }
    };

    return (
        <div className="">
            <button
                type={type}
                onClick={type === "button" ? handleClick : undefined }
                className="bg-cyan-400 text-white px-6 py-2 rounded-full border-none"
            >
                {label}
            </button>
        </div>
    );
};

export default Botao;
