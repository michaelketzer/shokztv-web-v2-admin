import { Menu, Icon } from 'antd';
import { ReactElement, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import useRights from '../../store/rights';

const pages = [{
    icon: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    rights: ['ADMIN_ACCESS'],
}, {
    icon: 'lock',
    name: 'Rollen & Rechte',
    path: '/rights',
    rights: ['ADMIN_ACCESS'],
}, {
    icon: 'tags',
    name: 'Tags',
    path: '/tags',
    rights: ['ARTICLE_CREATE', 'ARTICLE_EDIT', 'ARTICLE_DELETE', 'VIDEO_CREATE', 'VIDEO_EDIT', 'VIDEO_DELETE', 'EVENTS_CREATE', 'EVENT_EDIT', 'EVENT_DELETE'],
}, {
    icon: 'file-text',
    name: 'Articles',
    path: '/articles',
    rights: ['ARTICLE_CREATE', 'ARTICLE_EDIT', 'ARTICLE_DELETE'],
}, {
    icon: 'video-camera',
    name: 'Videos',
    path: '/videos',
    rights: ['VIDEO_CREATE', 'VIDEO_EDIT', 'VIDEO_DELETE'],
}, {
    icon: 'idcard',
    name: 'Organizer',
    path: '/organizer',
    rights: ['ORGANIZER_CREATE', 'ORGANIZER_EDIT', 'ORGANIZER_DELETE'],
}, {
    icon: 'calendar',
    name: 'Events',
    path: '/events',
    rights: ['EVENTS_CREATE', 'EVENT_EDIT', 'EVENT_DELETE'],
}, {
    icon: 'read',
    name: 'News',
    path: '/news',
    rights: ['NEWS_CREATE', 'NEWS_EDIT', 'NEWS_DELETE'],
}];

export default function PageMenu(): ReactElement {
    const router = useRouter();
    const rightsCheck = useRights(true);
    
    return <Menu selectedKeys={[router.pathname]} mode="horizontal" theme={'dark'}>
        {pages.filter(({rights}) => rightsCheck(rights)).map(({path, name, icon}) => <Menu.Item key={path}>
            <Link href={path}>
                <div>
                    <Icon type={icon} />
                    {name}
                </div>
            </Link>
        </Menu.Item>)}
  </Menu>;
}