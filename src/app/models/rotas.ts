import { Funcionalidade } from '../enum/funcionalidade';

export class Rotas {
  public link!: string;
  public label!: string;
  public icon!: string;
  public acesso!: Funcionalidade[];
}

export const DEFAULT_ROTAS: Rotas[] = [
  {
    link: '/home',
    label: 'Home',
    icon: 'home',
    acesso: [Funcionalidade['']],
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
  },
  {
    link: '/projetos',
    label: 'Projetos',
    icon: 'bar_chart',
    acesso: [
      Funcionalidade['Gerenciar projeto'],
      Funcionalidade['Consultar projeto'],
    ],
  },
  {
    link: '/cargos',
    label: 'Cargos',
    icon: 'badge',
    acesso: [
      Funcionalidade['Consultar cargo'],
      Funcionalidade['Gerenciar cargo'],
    ],
  },
  {
    link: '/usuarios',
    label: 'Usuarios',
    icon: 'account_circle',
    acesso: [
      Funcionalidade['Consultar usuário'],
      Funcionalidade['Gerenciar usuário'],
    ],
  },
  {
    link: '/perfis-acesso',
    label: 'Perfis de acesso',
    icon: 'person_shield',
    acesso: [
      Funcionalidade['Consultar perfil de acesso'],
      Funcionalidade['Gerenciar perfil de acesso'],
    ],
  },
];
