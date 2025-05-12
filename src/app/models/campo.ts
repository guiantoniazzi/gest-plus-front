import { Observable } from "rxjs";
import { TipoCampo } from "../enum/tipoCampo";
import { ValidacaoCampo } from "../enum/validacaoCampo";

export type Campo = {
    nome: string;
    titulo: string;
    tipo: TipoCampo;
    obrigatorio?: boolean;
    mascara?: string;
    maximo?: number;
    valor?: string | number | boolean | ListaSelect[];
    linha?: number;
    // lista?: Observable<FuncoesSistema[]>;
    lista?: ListaSelect[];
    listaObservable?: Observable<ListaSelect[]>;
    invisivel?: boolean;
    condicao?: string;
    validacao?: ValidacaoCampo
};

type ListaSelect = {
    label: string;
    valor: string | number;
};