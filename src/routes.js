import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './pages/home';
import Funcionario from './pages/funcionario';
import Distribuicao from './pages/distribuicao';
import Navbar from './Navbar';

export default function Routes() {
    return (
        <BrowserRouter>
            <Navbar />
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/funcionario" component={Funcionario}/>
                <Route exact path="/distribuicao" component={Distribuicao}/>
            </Switch>
        </BrowserRouter>
    )
}