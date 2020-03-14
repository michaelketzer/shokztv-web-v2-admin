import React, { ReactElement } from 'react';
import VideoList from '../components/pages/videos/VideoList';
import { Divider } from 'antd';
import AddVideo from '../components/pages/videos/AddVideo';
import PageFrame from '../components/PageFrame';

export default function Videos(): ReactElement {
    return <PageFrame title={'Videos'}>
        <AddVideo />
        <Divider />
        <VideoList />
    </PageFrame>;
}
