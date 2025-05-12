import { FuncionarioCliente } from "./funcionarioCliente";

export type ClienteEmpresa = {
    cdCliente: number;
    cdEmpresa: number;
    dtInicio: Date;
    ativo: boolean;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    funcionarios: FuncionarioCliente[];
};