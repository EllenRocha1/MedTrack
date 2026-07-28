import Botao from '../../Componentes/Botao'
const PaginaCadastro3 = ({h1}) => {
    
    return(
        <div className="h-screen flex justify-center items-center w-full">
            <div className="flex flex-col gap-10 self-center sm:shadow-lg sm:shadow-cyan-500/50 sm:p-20 w-3/5">
                <h1 className="text-2xl text-center font-semibold">{h1}</h1>
                <Botao 
                    label='Agora você pode fazer o login'
                    destino='/login'></Botao>
            </div>
        </div>
    )
}

export default PaginaCadastro3