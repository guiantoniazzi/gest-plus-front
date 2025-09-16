import { PessoaAux } from "./pessoaAux";

export type PessoaAtividade = {
    cdPessoa: number;
    cdAtiv: number;
    dtInicio: Date;
    dtFim: Date;
    qtdHr: number;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    pessoaAux: PessoaAux;
};