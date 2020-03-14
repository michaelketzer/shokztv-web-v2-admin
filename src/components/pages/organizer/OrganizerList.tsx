import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizer, patchOrganizer, deleteOrganizer } from "../../../store/Organizer";
import { organizerSelector } from "../../../store/selectors/organizer";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Table, Button, Popconfirm, Modal, Input } from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import FileForm from "../../FileForm";

const renderImage = (src) => <img src={`${process.env.API_URL}${src}`} alt='organization-logo'/>
const getColumns = (onDelete: (id: number) => Promise<void>, onEdit: (id: number) => void) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Events',
    dataIndex: 'events',
    key: 'events',
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
  {
    title: '',
    key: 'actions',
    render: (text, record) => <ButtonGroup>
      <Button icon={<EditOutlined />} onClick={() => onEdit(record.id)} />
      <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.id)} disabled={record.events > 0}>
        <Button type="danger" icon={<DeleteOutlined />} disabled={record.events > 0} />
      </Popconfirm>
    </ButtonGroup>,
  },
];

export default function OrganizerList(): ReactElement {
    const dispatch = useDispatch();
    const organizers = Object.values(useSelector(organizerSelector)).sort(({id: a}, {id: b}) => b - a);

    useEffect(() => {
        dispatch(loadOrganizer());
    },[]);

    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState<string | File | null>(null);
    const [logo, setLogo] = useState<string | File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const onEdit = (id: number) => {
      const entry = organizers.find(({id: rowId}) => rowId === id);
      setId(id);
      setName(entry.name);
      setIcon(entry.icon);
      setLogo(entry.logo);
      setShowModal(true);
    };

    const onPatch = async () => {
      setLoading(true);
      await dispatch(patchOrganizer(id, name, icon instanceof File ? icon : undefined, logo instanceof File ? logo : undefined));
      setLoading(false);
      setShowModal(false);
      setName('');
      setIcon(null);
      setLogo(null);
    }

    const onDelete = async (id: number) => {
      await dispatch(deleteOrganizer(id));
    }

    const columns = getColumns(onDelete, onEdit);

    return <>
      <Table dataSource={organizers} columns={columns} rowKey={'id'}/>
      <Modal title="Veranstalter bearbeiten" visible={showModal} onOk={onPatch} onCancel={() => setShowModal(false)} confirmLoading={loading}>
        <Form layout={'vertical'}>
          <Form.Item label={'Name'}>
              <Input id="name" type="text" value={name} onChange={({target}) => setName(target.value)}/>
          </Form.Item>

          <FileForm file={icon} setFile={setIcon} label={'Icon'} />
          <FileForm file={logo} setFile={setLogo} label={'Logo'} />
        </Form>
      </Modal>
    </>;
}