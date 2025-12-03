import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function App() {
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [lista, setLista] = useState([]);

  const adicionarProduto = () => {
    if (!produto || !quantidade || !preco) {
      alert("Preencha todos os campos!");
      return;
    }

    const novo = {
      nome: produto,
      quantidade: Number(quantidade),
      preco: Number(preco),
      total: Number(quantidade) * Number(preco),
    };

    setLista([...lista, novo]);
    setProduto("");
    setQuantidade("");
    setPreco("");
  };

  const gerarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(lista);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "produtos.xlsx");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Cadastro de Produtos</h2>

      <input
        type="text"
        placeholder="Nome do produto"
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
      /><br/><br/>

      <input
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      /><br/><br/>

      <input
        type="number"
        placeholder="Preço unitário"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      /><br/><br/>

      <button onClick={adicionarProduto}>Adicionar</button>

      <h3>Produtos cadastrados</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço (R$)</th>
            <th>Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>{item.quantidade}</td>
              <td>{item.preco.toFixed(2)}</td>
              <td>{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={gerarExcel}>Gerar Excel</button>
    </div>
  );
}

export default App;
