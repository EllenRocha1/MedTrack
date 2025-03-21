import { useState, useEffect } from "react";

const useMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);

  // useEffect(() => {
  //   //fetch("/DADOS_ABERTOS_MEDICAMENTOS.csv")
  //     .then(response => response.text())
  //     .then(csv => {
  //       console.log("CSV Carregado:", csv);
  //       const linhas = csv.split("\n").map(linha => linha.split(";"));
  //       const cabecalho = linhas[0].map(item => item.trim());
  //
  //       const dados = linhas.slice(1).map(linha => {
  //         let obj = {};
  //         linha.forEach((valor, i) => {
  //           obj[cabecalho[i]] = valor ? valor.replace(/"/g, '').trim() : '';
  //         });
  //         return obj;
  //       });
  //
  //       setMedicamentos(dados);
  //       console.log("Dados Processados:", dados);
  //     })
  //     .catch(error => console.error("Erro ao carregar CSV:", error));
  // }, []);

  const buscarAgenteAtivo = (nomeMedicamento) => {
    const medicamento = medicamentos.find(med =>
      med["NOME_PRODUTO"]?.toLowerCase() === nomeMedicamento.toLowerCase()
    );
    return medicamento ? medicamento["PRINCIPIO_ATIVO"] : "";
  };

  const filtrarMedicamentos = (termo) => {
    return medicamentos
      .filter(med => med["NOME_PRODUTO"]?.toLowerCase().includes(termo.toLowerCase()))
      .map(med => med["NOME_PRODUTO"]);
  };

  return { buscarAgenteAtivo, filtrarMedicamentos };
};

export default useMedicamentos;
