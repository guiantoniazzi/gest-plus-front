import { SituacaoProj } from "./situacaoProj";

export type Atividade = {
    cdAtiv: number;
    cdProj: number;
    nomeAtiv: string;
    dtInicioPrevista: Date;
    dtFimPrevista: Date;
    qtdHrPrevista: number;
    qtdHr: number;
    vlrAtiv: number;
    dtInicioAtiv: Date;
    dtFimAtiv: Date;
    situacaoAtiv: number;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    situacaoProj: SituacaoProj;
};