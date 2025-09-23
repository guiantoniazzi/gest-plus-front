import { PerfisAcesso } from "./perfisAcesso";
import { Pessoa } from "./pessoa";
import { Usuario } from "./usuario";

export type Associacao = {
    ativo: boolean;
    cdEmpresa: number;
    cdPerfil: number;
    dtValid: Date;
    empresa: Pessoa;
    perfil: PerfisAcesso;
    usuario: Usuario
};