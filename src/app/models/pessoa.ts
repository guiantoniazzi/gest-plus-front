import { ClienteEmpresa } from "./clienteEmpresa";

export type Pessoa = {
    cdPessoa: number;
    tpPessoa: string;
    nome: string;
    dtNasc: Date;
    cpfCnpj: string;
    rg: string;
    email: string;
    ativo: boolean;
    cliente: boolean;
    empresa: boolean;
    imagem: string;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    clienteEmpresas: ClienteEmpresa;
};