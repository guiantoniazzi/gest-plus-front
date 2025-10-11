import { get } from "http";

export const environment = {
    apiBaseUrl: 'http://localhost:3030/api',
    endpoints: {
        login: {
            autenticar: '/login/autenticar',
        },
        pessoas: {
            getAll: '/pessoas/getAll',
            getClientes: '/pessoas/getClientes',
            getFuncionarios: '/pessoas/getFuncionarios',
            cadastrar: '/pessoas/cadastrar',
            alterar: '/pessoas/alterar',
            getMeusFuncionarios: '/pessoas/getMeusFuncionarios',
            getPessoas: '/pessoas/getPessoas',
            getEmpresasAdm: '/pessoas/getEmpresasAdm',
        },
        perfisAcesso: {
            cadastrar: '/perfisAcesso/cadastrar',
            alterar: '/perfisAcesso/alterar',
            getPerfisComFuncoes: '/perfisAcesso/getPerfisComFuncoes',
        },
        funcoesSistema: {
            getAllActive: '/funcoesSistema/getAllActive',
        },
        cargo: {
            getAll: '/cargo/getAll',
            cadastrar: '/cargo/cadastrar',
            alterar: '/cargo/alterar',
        },
        usuario: {
            getAll: '/usuario/getAll',
            cadastrar: '/usuario/cadastrar',
            alterar: '/usuario/alterar',
            associar: '/usuario/associar',
            getAssociacoes: '/usuario/getAssociacoes',
            alterarAssociacao: '/usuario/alterarAssociacao',
        },
        projeto: {
            getAll: '/projeto/getAll',
            getAllByCdPessoa: '/projeto/getAllByCdPessoa',
            getHistorico: '/projeto/getHistorico',
            cadastrar: '/projeto/cadastrar',
            alterar: '/projeto/alterar',
        },
        situacaoProj: {
            getAll: '/situacaoProj/getAll',
        },
        atividade: {
            getByProj: '/atividade/getByProj',
            cadastrar: '/atividade/cadastrar',
            alocar: '/atividade/alocar',
        }
    }
}