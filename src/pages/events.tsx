import React, { ReactElement, useState } from 'react';
import { Button, Divider, Drawer } from 'antd';
import AddEventForm from '../components/pages/events/AddEventForm';
import Link from 'next/link';
import EventsList from '../components/pages/events/EventsList';
import PageFrame from '../components/PageFrame';

export default function Events(): ReactElement {
    const [showAddForm, setShowAddForm] = useState(false);
    return <PageFrame title={'Events'}>
        <Button type="primary" onClick={() => setShowAddForm(true)}>
            Neuer Event
        </Button>

        <Drawer
            title="Create new Event"
            width={1024}
            onClose={() => setShowAddForm(false)}
            visible={showAddForm}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Link href={'/event/newEvent'}>
                <Button type="primary">
                    Als Seite öffnen
                </Button>
            </Link>
            <AddEventForm closeCallback={() => setShowAddForm(false)}/>
        </Drawer>
        <Divider />

        <EventsList />
    </PageFrame>;
}
