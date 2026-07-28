const CampoTexto = ({ type,id, label, placeholder, value, onChange, name }) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-left text-gray-700 font-medium">{label}</label>
        <input
          placeholder={placeholder}
          name={name}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full h-10 px-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
      </div>
    );
  };
  
  export default CampoTexto;
  