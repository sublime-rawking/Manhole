import DashboardIcon from '../assets/icons/dashboard.svg';
import MicrochipIcon from '../assets/icons/microchip.svg';
import MapIcon from '../assets/icons/mapview.svg';

const sidebar_menu = [
    {
        id: 1,
        icon: DashboardIcon,
        path: '/',
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: MicrochipIcon,
        path: '/devices',
        title: 'Devices',
    },
    {
        id: 3,
        icon: MapIcon,
        path: '/mapView',
        title: 'Map View',
    },
    // {
    //     id: 4,
    //     icon: ShippingIcon,
    //     path: '/orders',
    //     title: 'Orders',
    // },

]

export default sidebar_menu;