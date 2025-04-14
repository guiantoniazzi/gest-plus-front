import { TipoCampo } from "../enum/tipoCampo";

export type Campo = {
    nome: string;
    titulo: string;
    tipo: TipoCampo;
    obrigatorio: boolean;
    mascara?: string;
    maximo?: number;
};