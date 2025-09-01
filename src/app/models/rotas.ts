import { Funcionalidade } from '../enum/funcionalidade';

export class Rotas {
  public link!: string;
  public label!: string;
  public icon!: string;
  public acesso!: Funcionalidade[];
  public visivel!: boolean;
}

export const DEFAULT_ROTAS: Rotas[] = [
  {
    link: '/home',
    label: 'Home',
    icon: 'home',
    acesso: [Funcionalidade['']],
    visivel: true
  },
  {
    link: '/pessoas',
    label: 'Pessoas',
    icon: 'groups',
    acesso: [
      Funcionalidade['Consultar cliente'],
      Funcionalidade['Consultar empresa consultoria'],
      Funcionalidade['Consultar funcionário cliente'],
      Funcionalidade['Consultar pessoa'],
      Funcionalidade['Gerenciar cliente'],
      Funcionalidade['Gerenciar empresa consultoria'],
      Funcionalidade['Gerenciar funcionário cliente'],
      Funcionalidade['Gerenciar pessoa'],
    ],
    visivel: true
  },
  {
    link: '/pessoas/cadastro',
    label: 'Pessoas',
    icon: 'groups',
    acesso: [
      Funcionalidade['Gerenciar cliente'],
      Funcionalidade['Gerenciar empresa consultoria'],
      Funcionalidade['Gerenciar funcionário cliente'],
      Funcionalidade['Gerenciar pessoa'],
    ],
    visivel: false
  },
  {
    link: '/projeto',
    label: 'Projetos',
    icon: 'bar_chart',
    acesso: [
      Funcionalidade['Gerenciar projeto'],
      Funcionalidade['Consultar projeto'],
    ],
    visivel: true
  },
  {
    link: '/projeto/cadastro',
    label: 'Projetos',
    icon: 'bar_chart',
    acesso: [
      Funcionalidade['Gerenciar projeto'],
    ],
    visivel: false
  },
  {
    link: '/projeto/detalhe',
    label: 'Projetos',
    icon: 'bar_chart',
    acesso: [
      Funcionalidade['Consultar projeto'],
      Funcionalidade['Gerenciar projeto'],
    ],
    visivel: false
  },
  {
    link: '/cargos',
    label: 'Cargos',
    icon: 'badge',
    acesso: [
      Funcionalidade['Consultar cargo'],
      Funcionalidade['Gerenciar cargo'],
    ],
    visivel: true
  },
  {
    link: '/usuarios',
    label: 'Usuarios',
    icon: 'account_circle',
    acesso: [
      Funcionalidade['Consultar usuário'],
      Funcionalidade['Gerenciar usuário'],
    ],
    visivel: true
  },
  {
    link: '/perfis-acesso',
    label: 'Perfis de acesso',
    icon: 'person_shield',
    acesso: [
      Funcionalidade['Consultar perfil de acesso'],
      Funcionalidade['Gerenciar perfil de acesso'],
    ],
    visivel: true
  },
  {
    link: '/perfis-acesso/cadastro',
    label: 'Cadastro de perfis de acesso',
    icon: '',
    acesso: [
      Funcionalidade['Gerenciar perfil de acesso'],
    ],
    visivel: false
  },
];
