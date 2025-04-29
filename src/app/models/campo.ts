import { Observable } from "rxjs";
import { TipoCampo } from "../enum/tipoCampo";
import { FuncoesSistema } from "./funcoesSistema";

export type Campo = {
    nome: string;
    titulo: string;
    tipo: TipoCampo;
    obrigatorio?: boolean;
    mascara?: string;
    maximo?: number;
    valor?: string | number | boolean | FuncoesSistema[];
    linha?: number;
    lista?: Observable<FuncoesSistema[]>;
    invisivel?: boolean;
};