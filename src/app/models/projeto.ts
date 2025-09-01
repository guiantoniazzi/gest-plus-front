import { SituacaoProj } from "./situacaoProj";

export type Projeto = {
  cdProj: number;
  cdEmpresa: number;
  cdCliente: number;
  idProjInterno: string;
  idProjCliente?: string;
  tpProj: string; // (A / P)
  nomeProj: string;
  cdRespProj: number;
  dtInicioAvaliacao: Date;
  dtInicioNegociacao?: Date;
  dtInicioPrevista: Date;
  dtFimPrevista?: Date;
  qtdHrProj: number;
  vlrHrProj: number;
  vlrBaseProj: number;
  vlrDescontoComercial: number;
  vlrAcrescimoProjeto: number;
  vlrFinalProjeto: number;
  dtInicioProj: Date;
  dtFimProj?: Date;
  vlrFaturado: number;
  idSituacaoProj: number;
  usuInclusao: string;
  dtHrInclusao: Date;
  usuAlteracao?: string;
  dtHrAlteracao?: Date;
  situacaoProj: SituacaoProj;
};