import React, { ReactElement, useState } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import { Button, Divider, Drawer } from 'antd';
import AddEventForm from './events/AddEventForm';
import Link from 'next/link';
import EventsList from './events/EventsList';
const { Header, Content } = Layout;

export default function Events(): ReactElement {
    const [showAddForm, setShowAddForm] = useState(false);
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <title>Events</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header  style={{ height: '46px' }}><PageMenu /></Header>
        <Content style={{ padding: '50px', overflowY: 'scroll'}}>
            <div>
                <Button type="primary" onClick={() => setShowAddForm(true)}>
                    Neues Event
                </Button>

                <Drawer
                    title="Create new Event"
                    width={1024}
                    onClose={() => setShowAddForm(false)}
                    visible={showAddForm}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Link href={'/addEvent'}>
                        <Button type="primary">
                            Als Seite öffnen
                        </Button>
                    </Link>
                    <AddEventForm closeCallback={() => setShowAddForm(false)}/>
                </Drawer>
                <Divider />

                <EventsList />
            </div>
        </Content>
    </Layout>;
}
