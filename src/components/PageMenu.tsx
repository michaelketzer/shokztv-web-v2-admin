import { Menu } from 'antd';
import { ReactElement } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import useRights from '../store/rights';
import { DashboardOutlined, LockOutlined, TagsOutlined, FileTextOutlined, VideoCameraOutlined, IdcardOutlined, ReadOutlined, CalendarOutlined, UserOutlined, PlayCircleOutlined } from '@ant-design/icons';

const pages = [{
    icon: <DashboardOutlined />,
    name: 'Dashboard',
    path: '/dashboard',
    rights: [],
}, {
    icon: <LockOutlined />,
    name: 'Rollen & Rechte',
    path: '/rights',
    rights: [],
}, {
    icon: <UserOutlined />,
    name: 'User',
    path: '/user',
    rights: [],
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
}, {
    icon: <PlayCircleOutlined />,
    name: 'Streamer',
    path: '/streamer',
    rights: ['STREAMER_CREATE', 'STREAMER_REMOVE'],
}];

export default function PageMenu(): ReactElement {
    const router = useRouter();
    const rightsCheck = useRights(true);
    
    return (
        <Menu selectedKeys={[router.pathname]} mode="horizontal" theme={'dark'}>
            {pages.filter(({rights}) => rightsCheck(rights.concat('ADMIN_ACCESS'))).map(({path, name, icon}) => <Menu.Item key={path}>
                <Link href={path}>
                    <div>{icon}&nbsp;{name}</div>
                </Link>
            </Menu.Item>)}
      </Menu>
    );
}