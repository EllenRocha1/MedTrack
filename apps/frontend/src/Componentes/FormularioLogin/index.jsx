import CampoTexto from "../CampoTexto";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormularioLogin = ({ campos}) => {
  const [formData, setFormData] = useState(
    campos.reduce((acc, campo) => ({ ...acc, [campo.name]: "" }), {})
  );
  const navigate = useNavigate();

  // Atualiza o estado do input de forma dinâmica
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const irPraProxima = () => {
    navigate("/cadastro_user", { state: formData });
  };

  return (
    <div className="flex flex-col my-2 p-10 gap-4 justify-between w-[400px]">
      {campos.map((campo) => 
      (
        <CampoTexto
          key={campo.name}
          type={campo.type}
          id={campo.id}
          label={campo.label}
          name={campo.name}
          value={formData[campo.name]}
          placeholder={campo.placeholder}
          onChange={handleChange}
        />))
        
      }
      </div>)
      }
export default FormularioLogin;
