import React, { ReactElement } from 'react';
import PageFrame from '../components/PageFrame';
import AddStreamer from '../components/pages/streamer/AddStreamer';
import StreamerList from '../components/pages/streamer/StreamerList';
import { Divider } from 'antd';

export default function Tags(): ReactElement {
    return <PageFrame title={'Streamer'}>
        <AddStreamer />

        <Divider />
        
        <StreamerList />
    </PageFrame>;
}
