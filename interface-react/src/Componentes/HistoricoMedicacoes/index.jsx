const RelatorioMedicacao = ({dados}) => {
    console.log(dados)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-cyan-500 mb-4">Relatório de Medicação</h1>
        
        <div className="mb-6">
          <p><strong>Nome do Paciente:</strong> {dados.nome || "Não informado"}</p>
          <p><strong>Semana de Referência:</strong> {dados.semana || "Não informado"}</p>
        </div>
  
        <table className="w-full border-collapse border border-cyan-300">
          <thead>
            <tr className="bg-cyan-100">
              <th className="border border-cyan-300 px-4 py-2">Data</th>
              <th className="border border-cyan-300 px-4 py-2">Nome do Remédio</th>
              <th className="border border-cyan-300 px-4 py-2">Horário</th>
              <th className="border border-cyan-300 px-4 py-2">Dose</th>
              <th className="border border-cyan-300 px-4 py-2">Tomado?</th>
              <th className="border border-cyan-300 px-4 py-2">Observações</th>
            </tr>
          </thead>
          {/*<tbody>*/}
          {/*  {dados.registros.length > 0 ? (*/}
          {/*    dados.registros.map((registro, index) => (*/}
          {/*      <tr key={index} className="text-center">*/}
          {/*        <td className="border border-cyan-300 px-4 py-2">{registro.data}</td>*/}
          {/*        <td className="border border-cyan-300 px-4 py-2">{registro.remedio}</td>*/}
          {/*        <td className="border border-cyan-300 px-4 py-2">{registro.horario}</td>*/}
          {/*        <td className="border border-cyan-300 px-4 py-2">{registro.dose}</td>*/}
          {/*        <td className="border border-cyan-300 px-4 py-2">*/}
          {/*          {registro.tomado ? "✅ Sim" : "❌ Não"}*/}
          {/*        </td>*/}
          {/*        <td className="border border-cyan-300 px-4 py-2">{registro.observacoes || "-"}</td>*/}
          {/*      </tr>*/}
          {/*    ))*/}
          {/*  ) : (*/}
          {/*    <tr>*/}
          {/*      <td colSpan="6" className="text-center border border-cyan-300 px-4 py-2">*/}
          {/*        Nenhum registro encontrado.*/}
          {/*      </td>*/}
          {/*    </tr>*/}
          {/*  )}*/}
          {/*</tbody>*/}
        </table>
      </div>
    );
  };
  
export default RelatorioMedicacao;
  