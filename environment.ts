export const environment = {
    apiBaseUrl: 'http://localhost:3030/api',
    endpoints: {
        login: {
            autenticar: '/login/autenticar',
        },
        pessoas: {
            getAll: '/pessoas/getAll',
        },
        perfisAcesso: {
            getPerfisComFuncoes: '/perfisAcesso/getPerfisComFuncoes',
        }
    }
}