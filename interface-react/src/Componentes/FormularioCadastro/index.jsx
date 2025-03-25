const FormularioCadastro = ({ h1,
                                campos,
                                botaos,
                                onSubmit,
                                formData,
                                handleChange}) => {
    return (
        <div className="flex flex-col sm:shadow-lg sm:shadow-cyan-500/50 sm:p-20 sm:w-3/5 w-full m-10">
            <h1 className="text-2xl font-semibold">{h1}</h1>
            <form onSubmit={onSubmit}>
                <div className="flex flex-col my-2 gap-4 justify-between">
                    {campos.map((campo) => (
                        <div key={campo.name}>
                            {campo.type === "select" ? (
                                <div key={campo.id} className="flex flex-col">
                                    <label className="text-left text-gray-700 font-medium" htmlFor={campo.id}>{campo.label}</label>
                                    <select
                                        id={campo.id}
                                        name={campo.name}
                                        value={formData[campo.name] || ""}
                                        onChange={handleChange}
                                        className=" border p-2 border-y-cyan-400 rounded-lg">
                                        {campo.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.text}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <label className="text-left text-gray-700 font-medium" htmlFor={campo.id}>{campo.label}</label>
                                    <input
                                        type={campo.type}
                                        id={campo.id}
                                        name={campo.name}
                                        value={formData[campo.name] || ""}
                                        placeholder={campo.placeholder}
                                        onChange={handleChange}
                                        className="border p-2 border-cyan-400 rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between">
                    {botaos.map((botao, index) => (
                        <button
                            key={index}
                            type={botao.type || "button"}
                            className="flex bg-cyan-400 justify-between text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            {botao.label}
                        </button>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default FormularioCadastro;