import { FuncoesSistema } from "./funcoesSistema";

export type PerfisAcesso = {
    cdPerfil: number;
    nomePerfil: string;
    ativo: boolean;
    usuInclusao: string;
    dtHrInclusao: Date;
    usuAlteracao: string;
    dtHrAlteracao: Date;
    funcoes: FuncoesSistema[];
};