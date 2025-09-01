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
        },
        projeto: {
            getAll: '/projeto/getAll',
            cadastrar: '/projeto/cadastrar',
            alterar: '/projeto/alterar',
        },
        situacaoProj: {
            getAll: '/situacaoProj/getAll',
        }
    }
}