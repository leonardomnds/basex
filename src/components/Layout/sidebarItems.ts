import HomeIcon from '@material-ui/icons/HomeRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';

const sidebarItems = [
  {
    label: 'Início',
    path: '/app/home',
    icon: HomeIcon,
    items: null,
  },
  {
    label: 'Cadastro',
    path: '/app/cadastro',
    icon: CategoryIcon,
    items: [
      {
        label: 'Clientes',
        path: 'pessoas',
      },
      // {
      //   label: 'Empresa',
      //   path: 'empresa',
      // },
      {
        label: 'Usuários',
        path: 'usuarios',
      }
    ],
  },
];

export default sidebarItems;
