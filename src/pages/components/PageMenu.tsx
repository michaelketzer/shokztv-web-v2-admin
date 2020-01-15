import { Menu, Icon } from 'antd';
import { ReactElement } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';

const pages = [{
    icon: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
}, {
    icon: 'lock',
    name: 'Rollen & Rechte',
    path: '/rights'
}, {
    icon: 'tags',
    name: 'Tags',
    path: '/tags'
}, {
    icon: 'file-text',
    name: 'Articles',
    path: '/articles'
}];

export default function PageMenu(): ReactElement {
    const router = useRouter();
    
    return <Menu selectedKeys={[router.pathname]} mode="horizontal" theme={'dark'}>
        {pages.map(({path, name, icon}) => <Menu.Item key={path}>
            <Link href={path}>
                <div>
                    <Icon type={icon} />
                    {name}
                </div>
            </Link>
        </Menu.Item>)}
  </Menu>;
}