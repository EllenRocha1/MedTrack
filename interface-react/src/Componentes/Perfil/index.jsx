import perfil from '../../Imagens/perfil.png';
import Box from '../Box';
import { CircleUser } from 'lucide-react';
import { getUserInfo} from "../Auth/AuthToken";
import {useEffect, useState} from "react";
import api from "../../Service/api";

const Perfil = ({vaiTer}) => {
  const [usuario, setUsuario] = useState("")
    const usuarioId = getUserInfo().id
    const [error, setError]= useState(null)
    const camposCadastro = [
    { nome: usuario.nome },
    { nome: usuario.email},
    { nome: usuario.telefone}
  ]
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


  return (
    <div className="flex flex-col items-center w-full p-2">
      <CircleUser size={80}></CircleUser>
      <h1 className="mt-2">{usuario.nome}</h1>
      <p className="mt-1">{usuario.email}</p>

      {vaiTer? (
        <div className='text-center mt-10'>
          <Box info={camposCadastro}/>
        </div>
      ):(<div></div>) }
    </div>
  );
};

export default Perfil;
