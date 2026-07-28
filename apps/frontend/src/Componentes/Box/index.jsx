const Box = ({ info}) => {
    return (
        <div className="flex flex-col gap-2">
            {info.map((campo) => (
                <div className="border items-center px-10 py-2 rounded-lg ">
                    <h2>{campo.nome}</h2>
                </div>
            ))}
        </div>
    );
};

export default Box;
