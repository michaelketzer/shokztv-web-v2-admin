import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizer } from "../../store/Organizer";
import { organizerSelector } from "../../store/selectors/organizer";
import { Table } from "antd";

const renderImage = (src) => <img src={`${process.env.API_URL}${src}`} alt='organization-logo'/>
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Icon',
    dataIndex: 'icon',
    key: 'icon',
    render: (text) => renderImage(text),
  },
  {
    title: 'Logo',
    dataIndex: 'logo',
    key: 'logo',
    render: (text) => renderImage(text),
  },
];

export default function OrganizerList(): ReactElement {
    const dispatch = useDispatch();
    const organizers = Object.values(useSelector(organizerSelector)).sort(({id: a}, {id: b}) => b - a);

    useEffect(() => {
        dispatch(loadOrganizer());
    },[]);

    return <Table dataSource={organizers} columns={columns} rowKey={'id'}/>;
}