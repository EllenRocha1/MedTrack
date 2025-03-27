import perfil from '../../Imagens/perfil.png';
import Box from '../Box';
import { CircleUser } from 'lucide-react';
import {getUserInfo, getUserRole} from "../Auth/AuthToken";
import {useEffect, useState} from "react";
import api from "../../Service/api";

const Perfil = ({vaiTer, dependenteId}) => {
    const [usuario, setUsuario] = useState("")
    const [dependente, setDependente] = useState("")
    const usuarioId = getUserInfo().id
    const role = getUserRole()
    const isAdmin = role === "ADMINISTRADOR";
    const [error, setError]= useState(null)


    const camposCadastro = [
    { nome: dependente.nome },
    { nome: dependente.email},
    { nome: dependente.telefone}
    ]

    useEffect(() => {
        if(!vaiTer || !isAdmin ){
            const getUsuario = async ()=>{
                try {
                    const response = await api.get(`http://localhost:8081/usuarios/buscar/${usuarioId}`);
                    console.log("Dados recebidos USuea:", response);
                    setUsuario(response);
                } catch (err) {
                    setError(err.message);
                }
            }
            getUsuario()}
            else if (vaiTer || isAdmin){
                const getDependente = async ()=>{
                    try {
                        const response = await api.get(`http://localhost:8081/dependentes/buscar/${dependenteId}`);
                        console.log("Dados recebidos USuea:", response);
                        setDependente(response);
                    } catch (err) {
                        setDependente(err.message);
                    }
                }
            getDependente()}
        }, [vaiTer, isAdmin]);


  return (
    <div className="flex flex-col  items-center w-full p-2">
      <CircleUser size={80}></CircleUser>
      <h1 className="mt-2">{vaiTer ? dependente.nome : usuario.nome}</h1>
      <p className="mt-1">{vaiTer ? dependente.email : usuario.email}</p>

      {vaiTer? (
        <div className='text-center mt-10'>
          <Box info={camposCadastro}/>
        </div>
      ):(<div></div>) }
    </div>
  );
};

export default Perfil;
