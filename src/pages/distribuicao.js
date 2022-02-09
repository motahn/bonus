import './funcionario.css';

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumberFormat from "react-number-format";
import moment from "moment";

export default function Distribuicao() {

  const baseUrl = "http://localhost:60431/api/Distribuicao";
  const [data, setData] = useState([]);
  const [modalDistribuir, setModalDistribuir] = useState(false);

  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [totalDistribuido, settotalDistribuido] = useState(0);
  const [totalDisponibilizado, settotalDisponibilizado] = useState(0);
  const [saldo, setSaldo] = useState(0);

  const pedidoGet = async () => {
    abrirFecharModalDistribuir();  
    axios.get(baseUrl + '/' + totalDisponibilizado)
    .then(response => {
      setData(response.data);
      
      var i = 0; // CONTA FUNCIONÁRIOS
      var b = 0; // ACUMULA BONUS PAGO
      var s = 0; // SALDO FINAL
      for (i=0; i<response.data.length; i++) {
        b = b + response.data[i].bonus;
      }

      setTotalFuncionarios(i);
      settotalDistribuido(b);
      saldo = totalDisponibilizado - b;
      setSaldo(saldo);

    }).catch(error => {
      console.log(error);
    })
  };

  const handleChange = e => {
    settotalDisponibilizado(e.target.value)
  }

  const abrirFecharModalDistribuir = () => {
    setModalDistribuir(!modalDistribuir);
  };

  return (
    <div className="App">
      
      <br />
      <h3>Distribuição do bônus</h3>
      <hr />
      <header>
        <button className="btn btn-outline-success" onClick={() => abrirFecharModalDistribuir()}>Calcular</button>
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
            <th>Qtd. salários</th>
            <th>Data de amissão</th>
            <th>Tempo casa (anos)</th>
            <th>Peso</th>
            <th>Bônus</th>
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
              <td><NumberFormat value={f.qtdSalarios} displayType={"text"} decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={1} fixedDecimalScale={true} /></td>
              <td>{moment(f.dataAdmissao).format("DD/MM/YYYY")}</td>
              <td><NumberFormat value={f.tempoCasa} displayType={"text"} decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={1} fixedDecimalScale={true} /></td>
              <td><NumberFormat value={f.peso} displayType={"text"} decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={1} fixedDecimalScale={true} /></td>
              <td><NumberFormat value={f.bonus} displayType={"text"} thousandsGroupStyle="thousand" prefix="R$ " decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={2} fixedDecimalScale={true} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot class="table-light">
          <tr>
            <td></td>
            <td></td>
            <td>{totalFuncionarios} funcionario(s)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total distribuído</td>
            <td><NumberFormat value={totalDistribuido} displayType={"text"} thousandsGroupStyle="thousand" prefix="R$ " decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={2} fixedDecimalScale={true} /></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total disponibilizado</td>
            <td><NumberFormat value={totalDisponibilizado} displayType={"text"} thousandsGroupStyle="thousand" prefix="R$ " decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={2} fixedDecimalScale={true} /></td>            
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Saldo</td>
            <td><NumberFormat value={saldo} displayType={"text"} thousandsGroupStyle="thousand" prefix="R$ " decimalSeparator="." type="text" thousandSeparator={true} allowNegative={true} decimalScale={2} fixedDecimalScale={true} /></td>            
          </tr>
        </tfoot>
      </table>
      <Modal isOpen={modalDistribuir}>
        <ModalHeader>Montante disponibilizado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Valor para distribuir:</label>
            <br />
            <NumberFormat className="form-control" onChange={handleChange} value={totalDisponibilizado}
              decimalSeparator="." displayType="input" type="text" decimalScale={2} fixedDecimalScale={true} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-primary" onClick={() => pedidoGet()}>Distribuir</button> {" "}
          <button className="btn btn-outline-danger" onClick={() => abrirFecharModalDistribuir()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}