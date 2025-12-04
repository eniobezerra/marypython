import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

function App() {
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Carregar dados
  useEffect(() => {
    const dados = localStorage.getItem("produtos");
    if (dados) setLista(JSON.parse(dados));
  }, []);

  // Salvar sempre que mudar a lista
  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(lista));
  }, [lista]);

  const adicionarProduto = () => {
    if (!produto || !quantidade || !preco) {
      alert("Preencha tudo!");
      return;
    }

    const novo = {
      nome: produto,
      quantidade: Number(quantidade),
      preco: Number(preco),
      total: Number(quantidade) * Number(preco),
    };

    if (editIndex !== null) {
      const nova = [...lista];
      nova[editIndex] = novo;
      setLista(nova);
      setEditIndex(null);
    } else {
      setLista([...lista, novo]);
    }

    setProduto("");
    setQuantidade("");
    setPreco("");
  };

  const deletar = (i) => {
    setLista(lista.filter((_, index) => index !== i));
  };

  const editar = (i) => {
    const item = lista[i];
    setProduto(item.nome);
    setQuantidade(item.quantidade);
    setPreco(item.preco);
    setEditIndex(i);
  };

  const somaTotal = lista.reduce((acc, p) => acc + p.total, 0);

  // GERAR EXCEL
  const gerarExcel = () => {
    const dados = [
      ["Produto", "Quantidade", "Preço Unitário", "Total"],
      ...lista.map((p) => [p.nome, p.quantidade, p.preco, p.total]),
      [],
      ["", "", "Soma total:", somaTotal],
    ];

    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "produtos.xlsx");
  };

  // GERAR PDF
  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Produtos", 14, 15);

    doc.autoTable({
      head: [["Produto", "Qtd", "Preço", "Total"]],
      body: lista.map((p) => [
        p.nome,
        p.quantidade,
        p.preco.toFixed(2),
        p.total.toFixed(2),
      ]),
    });

    doc.text(
      `Total geral: R$ ${somaTotal.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("produtos.pdf");
  };

  const filtrada = lista.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Cadastro de Produtos</h2>

      <input
        type="text"
        placeholder="Buscar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      /><br /><br />

      <input
        type="text"
        placeholder="Nome"
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Preço"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      /><br /><br />

      <button onClick={adicionarProduto}>
        {editIndex !== null ? "Salvar edição" : "Adicionar"}
      </button>

      <h3>Produtos cadastrados</h3>

      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc" }}>
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrada.map((item, index) => (
              <tr key={index}>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
                <td>{item.preco.toFixed(2)}</td>
                <td>{item.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => editar(index)}>Editar</button>
                  <button
                    onClick={() => deletar(index)}
                    style={{ marginLeft: 5, color: "red" }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Total geral: R$ {somaTotal.toFixed(2)}</h3>

      <button onClick={gerarExcel}>Gerar Excel</button>
      <button onClick={gerarPDF} style={{ marginLeft: 10 }}>
        Gerar PDF
      </button>
    </div>
  );
}

export default App;
