
export default function Popup({ open, setOpen, texto, botao1 }) {


    return (
        open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex flex-col bg-white p-6 rounded shadow-lg">
                    <h2 className="text-black text-lg font-bold">{texto.h2}</h2>
                    <p className="text-black">{texto.sub}</p>
                    <div className="flex gap-4 justify-center">

                        <button
                            className="mt-4  bg-cyan-500 text-white px-4 py-2 rounded"
                            onClick={botao1.funcao}
                        >
                            {botao1.label}
                        </button>
                        <button className="mt-4  bg-red-500 text-white px-4 py-2 rounded"
                                onClick={()=> setOpen(false)}>
                            Cancelar
                        </button>
                </div>
                </div>
            </div>
        )
    );
}
