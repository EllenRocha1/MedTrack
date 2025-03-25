import perfil from '../../Imagens/perfil.png';
import Box from '../Box';
import { CircleUser } from 'lucide-react';
import { getUserInfo} from "../Auth/AuthToken";
import {useEffect, useState} from "react";

const Perfil = ({vaiTer, userInfo}) => {
  const camposCadastro = [
    { nome: userInfo.nome },
    { nome: userInfo.email},
    { nome: userInfo.telefone}
  ]


  return (
    <div className="flex flex-col items-center w-full p-2">
      <CircleUser size={80}></CircleUser>
      <h1 className="mt-2">{userInfo.nome}</h1>
      <p className="mt-1">{userInfo.email}</p>

      {vaiTer? (
        <div className='text-center mt-10'>
          <Box info={camposCadastro}/>
        </div>
      ):(<div></div>) }
    </div>
  );
};

export default Perfil;
