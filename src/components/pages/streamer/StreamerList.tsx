import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Select, Popconfirm, Button, Badge } from "antd";
import { loadStreamer, removeStreamer } from "../../../store/Streamer";
import { DeleteOutlined } from "@ant-design/icons";
import { streamerSelector } from "../../../store/selectors/streamer";

const { Option } = Select;

const renderImage = (src) => <img height={75} src={`${process.env.API_URL}${src}`} alt='preview'/>
const getColumns = (deleteStreamer: (streamerId: number) => void) => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Twitch ID',
      dataIndex: 'twitchId',
      key: 'twitchId',
    },
    {
      title: 'Status',
      dataIndex: 'online',
      key: 'online',
      render: (text) => text === 1 ? <Badge color={'red'} status="processing" /> :  <Badge status="default" />,
    },
    {
      title: 'Preview',
      dataIndex: 'preview',
      key: 'preview',
      render: (text) => text.length > 0 ?renderImage(text) : '',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Viewer',
      dataIndex: 'viewer',
      key: 'viewer',
    },
    {
      title: '',
      key: 'actions',
      render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => deleteStreamer(record.id)}>
            <Button type="danger" icon={<DeleteOutlined />} />
      </Popconfirm>,
    },
  ];

export default function StreamerList(): ReactElement {
    const dispatch = useDispatch();
    const streamer = Object.values(useSelector(streamerSelector)).sort(({id: a}, {id: b}) => b - a);

    useEffect(() => {
        dispatch(loadStreamer());
    }, []);

    const deleteStreamer = (streamerId: number) => {
        dispatch(removeStreamer(streamerId));
    };

    return <>
        <Table dataSource={streamer} columns={getColumns(deleteStreamer)} rowKey={'id'}/>
    </>;
}