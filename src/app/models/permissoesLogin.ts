class PermissoesLogin {
    cdUsuario!: string;
    cdPessoa!: number;
    nome!: string;
    empresa!: Empresa[];
}

class Empresa {
    cdEmpresa!: number;
    nomeEmpresa!: string;
    cdFuncao!: number[];
}

export { PermissoesLogin, Empresa };