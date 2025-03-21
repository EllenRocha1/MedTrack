import {useEffect, useState} from "react";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../Service/api";

const Relatorio = ({ termoPesquisa }) => {

    const [dependentes, setDependentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const dependentesFiltrados = dependentes.filter((dep) =>
      dep.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

    useEffect(() => {
        const fetchDependentes = async () => {
            try {
                const data = await api.get("http://localhost:8081/dependentes/buscar/todos");
                setDependentes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDependentes();
    }, []);

    const adicionarDependente = (novoDependente) => {
        setDependentes([...dependentes, novoDependente]);
    };

  return (
      <div className="p-6">
        <div className="mt:flex flex-col max-h-[450px] gap-9 justify-center overflow-y-auto p-2 border border-cyan-200 rounded-lg">
          {dependentesFiltrados.map((dep) => (
              <div
                  key={dep.id}
                  className="flex justify-between bg-white p-5 border border-gray-300 items-center w-full"
                  onClick={() => navigate("/historico_medicacoes")}
              >
                <h1>{dep.nome}</h1>
                {dep.emDia ? <Check color="green" /> : <X color="red" />}
              </div>
          ))}
        </div>
      </div>
  );
};

export default Relatorio;