export const environment = {
    apiBaseUrl: 'http://localhost:3030/api',
    endpoints: {
        login: {
            autenticar: '/login/autenticar',
        },
        pessoas: {
            getAll: '/pessoas/getAll',
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
    }
}