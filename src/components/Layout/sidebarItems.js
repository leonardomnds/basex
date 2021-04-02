import HomeIcon from '@material-ui/icons/HomeRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';
// import AttachMoneyIcon from '@material-ui/icons/AttachMoneyRounded';
// import LocalOfferIcon from '@material-ui/icons/LocalOfferRounded';

// Usuários
//import UserListPage from '../../pages/app/cadastro/usuarios';
//import NewUserPage from '../../pages/app/cadastro/usuarios/new';

// Empresa
// eslint-disable-next-line import/no-cycle
//import NewCompanyPage from '../../pages/app/cadastro/empresa';

const sidebarItems = [
  {
    label: 'Início',
    path: 'home',
    page: <h1>Home</h1>,
    icon: HomeIcon,
    items: null,
  },
  {
    label: 'Cadastro',
    path: 'cadastro',
    page: null,
    icon: CategoryIcon,
    // items: [
    //   {
    //     label: 'Empresa',
    //     path: 'empresa',
    //     page: <NewCompanyPage />,
    //   },
    //   {
    //     label: 'Usuários',
    //     path: 'usuarios',
    //     page: <UserListPage />,
    //     items: [
    //       {
    //         path: 'novo',
    //         page: <NewUserPage />,
    //       },
    //       {
    //         path: 'editar/:id',
    //         page: <NewUserPage />,
    //       },
    //     ],
    //   },
    // ],
  },
];

export default sidebarItems;
