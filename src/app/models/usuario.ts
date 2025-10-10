import { Pessoa } from "./pessoa";

export type Usuario = {
    cdUsuario: string;
    cdPessoa: number;
    ativo: number;
    senha: string;
    dtValid: Date;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    qtdEmpresas: number;
    empresas: Pessoa[];
};