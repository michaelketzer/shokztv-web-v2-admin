import { Menu } from 'antd';
import { ReactElement } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import useRights from '../../store/rights';
import { DashboardOutlined, LockOutlined, TagsOutlined, FileTextOutlined, VideoCameraOutlined, IdcardOutlined, ReadOutlined, CalendarOutlined } from '@ant-design/icons';

const pages = [{
    icon: <DashboardOutlined />,
    name: 'Dashboard',
    path: '/dashboard',
    rights: ['ADMIN_ACCESS'],
}, {
    icon: <LockOutlined />,
    name: 'Rollen & Rechte',
    path: '/rights',
    rights: ['ADMIN_ACCESS'],
}, {
    icon: <TagsOutlined />,
    name: 'Tags',
    path: '/tags',
    rights: ['ARTICLE_CREATE', 'ARTICLE_EDIT', 'ARTICLE_DELETE', 'VIDEO_CREATE', 'VIDEO_EDIT', 'VIDEO_DELETE', 'EVENTS_CREATE', 'EVENT_EDIT', 'EVENT_DELETE'],
}, {
    icon: <FileTextOutlined />,
    name: 'Artikel',
    path: '/articles',
    rights: ['ARTICLE_CREATE', 'ARTICLE_EDIT', 'ARTICLE_DELETE'],
}, {
    icon: <VideoCameraOutlined />,
    name: 'Videos',
    path: '/videos',
    rights: ['VIDEO_CREATE', 'VIDEO_EDIT', 'VIDEO_DELETE'],
}, {
    icon: <IdcardOutlined />,
    name: 'Veranstalter',
    path: '/organizer',
    rights: ['ORGANIZER_CREATE', 'ORGANIZER_EDIT', 'ORGANIZER_DELETE'],
}, {
    icon: <CalendarOutlined />,
    name: 'Events',
    path: '/events',
    rights: ['EVENTS_CREATE', 'EVENT_EDIT', 'EVENT_DELETE'],
}, {
    icon: <ReadOutlined />,
    name: 'News',
    path: '/news',
    rights: ['NEWS_CREATE', 'NEWS_EDIT', 'NEWS_DELETE'],
}];

export default function PageMenu(): ReactElement {
    const router = useRouter();
    const rightsCheck = useRights(true);
    
    return (
        <Menu selectedKeys={[router.pathname]} mode="horizontal" theme={'dark'}>
            {pages.filter(({rights}) => rightsCheck(rights)).map(({path, name, icon}) => <Menu.Item key={path}>
                <Link href={path}>
                    <div>
                        {icon}
                        {name}
                    </div>
                </Link>
            </Menu.Item>)}
      </Menu>
    );
}