import { FuncionarioCliente } from "./funcionarioCliente";
import { PessoaAux } from "./pessoaAux";

export type Pessoa = {
    cdPessoa: number;
    tpPessoa: string;
    cpfCnpj: string;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    pessoaAux: PessoaAux;
    funcionarioCliente: FuncionarioCliente;
};