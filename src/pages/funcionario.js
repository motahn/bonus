import './funcionario.css';

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumberFormat from "react-number-format";
import moment from "moment";

export default function Funcionario() {

  const baseUrl = "http://localhost:60431/api/Funcionarios";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(
    {
      id: '',
      codigoMatricula: '',
      nomeCompleto: '',
      areaAtuacao: '',
      cargo: '',
      salarioBruto: '',
      dataAdmissao: ''
    });

  const selecionarFuncionario = (funcionario, opcao) => {
    setFuncionarioSelecionado(funcionario);
    (opcao === "Editar")
      ? abrirFecharModalEditar()
      : abrirFecharModalExcluir();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFuncionarioSelecionado({
      ...funcionarioSelecionado,
      [name]: value
    });
    console.log(funcionarioSelecionado);
  };

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  };

  const pedidoPost = async () => {
    delete funcionarioSelecionado.id;
    funcionarioSelecionado.salarioBruto = parseFloat(funcionarioSelecionado.salarioBruto);
    await axios.post(baseUrl, funcionarioSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  };

  const pedidoPut = async () => {
    funcionarioSelecionado.salarioBruto = parseFloat(funcionarioSelecionado.salarioBruto);
    await axios.put(baseUrl + "/" + funcionarioSelecionado.id, funcionarioSelecionado)
    .then(response => {
      var resposta = response.data;
      var dadosAuxiliar = data;
      dadosAuxiliar.map(f => {
        if (f.id === funcionarioSelecionado.id) {
          f.nomeCompleto = resposta.nomeCompleto;
        }
      });
      setUpdateData(true);
      abrirFecharModalEditar();
    }).catch(error => {
      console.log(error);
    })
  };

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + '/' + funcionarioSelecionado.id)
    setUpdateData(true);
    abrirFecharModalExcluir();
  };

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);

  return (
    <div className="App">
      <br />
      <h3>Cadastro de funcionários</h3>
      <hr />
      <header>
        <button className="btn btn-outline-success" onClick={() => abrirFecharModalIncluir()}>Incluir</button>
      </header>
      <hr />
      <table className="table">
        <thead className="table-primary">
          <tr>
            <th>Id</th>
            <th>Matrícula</th>
            <th>Nome completo</th>
            <th>Área de atuação</th>
            <th>Cargo</th>
            <th>Salário bruto</th>
            <th>Data de amissão</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.codigoMatricula}</td>
              <td>{f.nomeCompleto}</td>
              <td>{f.areaAtuacao}</td>
              <td>{f.cargo}</td>
              <td><NumberFormat value={f.salarioBruto} displayType={"text"} thousandsGroupStyle="thousand" prefix="R$ " decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={2} fixedDecimalScale={true} /></td>
              <td>{moment(f.dataAdmissao).format("DD/MM/YYYY")}</td>
              <td>
                <button className="btn btn-outline-primary" onClick={() => selecionarFuncionario(f, "Editar")}>Editar</button> {" "}
                <button className="btn btn-outline-danger" onClick={() => selecionarFuncionario(f, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir funcionário</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Matrícula:</label>
            <br />
            <input type="text" className="form-control" name="codigoMatricula" onChange={handleChange} />
            <br />
            <label>Nome:</label>
            <br />
            <input type="text" className="form-control" name="nomeCompleto" onChange={handleChange} />
            <br />

            <label>Área de atuação:</label>
            <br />
            <select className="form-select" name="areaAtuacao" onChange={handleChange} defaultValue="0">
              <option value="">...</option>
              <option value="Diretoria">Diretoria</option>
              <option value="Contabilidade">Contabilidade</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Serviços gerais">Serviços gerais</option>
              <option value="Relacionamento com cliente">Relacionamento com cliente</option>
            </select>
            <br />

            <label>Cargo:</label>
            <br />
            <select className="form-select" name="cargo" onChange={handleChange} defaultValue="0">
              <option value="">...</option>
              <option value="Funcionário">Funcionário</option>
              <option value="Estagiário">Estagiário</option>
            </select>
            <br />

            <label>Salário bruto:</label>
            <br />
            <NumberFormat className="form-control" name="salarioBruto" onChange={handleChange}
              decimalSeparator="." displayType="input" type="text" decimalScale={2} fixedDecimalScale={true} />
            <br />
            <label>Data de admissão:</label>
            <br />
            <NumberFormat className="form-control" name="dataAdmissao" onChange={handleChange}
              format="####-##-##" placeholder="aaaa-mm-dd" />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-primary" onClick={() => pedidoPost()}>Incluir</button> {" "}
          <button className="btn btn-outline-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar funcionário</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id:</label>
            <br />
            <input type="text" className="form-control" readOnly value={funcionarioSelecionado && funcionarioSelecionado.id} />
            <br />
            <label>Matrícula:</label>
            <br />
            <input type="text" className="form-control" name="codigoMatricula" onChange={handleChange}
              value={funcionarioSelecionado && funcionarioSelecionado.codigoMatricula} />
            <br />
            <label>Nome:</label>
            <br />
            <input type="text" className="form-control" name="nomeCompleto" onChange={handleChange}
              value={funcionarioSelecionado && funcionarioSelecionado.nomeCompleto} />
            <br />

            <label>Área de atuação:</label>
            <br />
            <select className="form-select" name="areaAtuacao" onChange={handleChange}
              value={funcionarioSelecionado && funcionarioSelecionado.areaAtuacao}>
              <option value="">...</option>
              <option value="Diretoria">Diretoria</option>
              <option value="Contabilidade">Contabilidade</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Serviços gerais">Serviços gerais</option>
              <option value="Relacionamento com cliente">Relacionamento com cliente</option>
            </select>
            <br />

            <label>Cargo:</label>
            <br />
            <select className="form-select" name="cargo" onChange={handleChange}
              value={funcionarioSelecionado && funcionarioSelecionado.cargo}>
              <option value="">...</option>
              <option value="Funcionário">Funcionário</option>
              <option value="Estagiário">Estagiário</option>
            </select>
            <br />

            <label>Salário bruto:</label>
            <br />
            <NumberFormat className="form-control" name="salarioBruto" onChange={handleChange}
              decimalSeparator="." displayType="input" type="text" decimalScale={2} fixedDecimalScale={true} 
              defaultValue={funcionarioSelecionado && funcionarioSelecionado.salarioBruto}/>
            <br />
            <label>Data de admissão:</label>
            <br />
            <NumberFormat className="form-control" name="dataAdmissao" onChange={handleChange}
              format="####-##-##" placeholder="aaaa-mm-dd"
              defaultValue={funcionarioSelecionado && moment(funcionarioSelecionado.dataAdmissao).format("YYYY-MM-DD")}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-primary" onClick={() => pedidoPut()}>Editar</button> {" "}
          <button className="btn btn-outline-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalExcluir}>
        <ModalHeader>Excluir funcionário</ModalHeader>
        <ModalBody>
          Confirma a exclusão do(a) funcionário(a) {funcionarioSelecionado && funcionarioSelecionado.nomeCompleto}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-primary" onClick={() => pedidoDelete()}>Sim</button> {" "}
          <button className="btn btn-outline-danger" onClick={() => abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );

}
