import { ReactElement, useEffect } from "react";
import { List } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { eventsSelector } from "../../store/selectors/event";
import { loadEvents } from "../../store/Events";
import { Event } from '../../@types/Entities/Event';

export default function EventsList(): ReactElement {
    const events: Event[] = Object.values(useSelector(eventsSelector)).sort(({id: a}, {id: b}) => b - a);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadEvents());
    }, []);

    return <List
        itemLayout="vertical"
        size="large"
        pagination={{
            pageSize: 10,
        }}
        dataSource={events}
        renderItem={item => {
            return <List.Item key={item.id}>
                {item.name}
                <style jsx global>{`
                    .ant-list-item-main {
                        overflow: hidden;
                    }
                `}</style>
            </List.Item>;
        }}
  />;
}