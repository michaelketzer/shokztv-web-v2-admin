import { ReactElement, useEffect, useState, useMemo } from "react";
import { Table, Tag, Button, Popconfirm, Drawer, Form, Input, Select, DatePicker, Icon } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { eventsSelector } from "../../store/selectors/event";
import { loadEvents, changeMainEvent, toggleFeature, deleteEvent, patchEvent } from "../../store/Events";
import { Event } from '../../@types/Entities/Event';
import dayjs from 'dayjs';
import ReactCountryFlag from "react-country-flag"
import { TagEntities } from "../../store/Tag";
import { tagsSelector } from "../../store/selectors/tag";
import ButtonGroup from "antd/lib/button/button-group";
import FileForm from "../components/FileForm";
import { loadOrganizer, OrganizerEntities } from "../../store/Organizer";
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';
import { getCodeList } from 'country-list';
import { organizerSelector } from "../../store/selectors/organizer";
import moment from 'moment';

const dateFormat = 'DD.MM.YYYY';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};

const columns = (tags: TagEntities, organizer: OrganizerEntities, onEdit: (record: Event) => void, onDelete: (id: number) => void, onChangeMainEvent: (id: number) => void, onChangeFeature: (id: number, feature: boolean) => void) => [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', key: 'date', render: (text, record) =>  dayjs.unix(record.start).format('DD.MM.') + ' - ' + dayjs.unix(record.end).format('DD.MM.YYYY')},
    { title: 'Organizer', key: 'organizer', render: (text, record) =>  <>{organizer[record.organizer] ? organizer[record.organizer].name : ''}</>},
    { title: 'Location', key: 'location', render: (text, record) =>  <>
        {record.country.length > 0 ? <><ReactCountryFlag countryCode={record.country} svg /> {record.location}</> : <></>}
    </>},
    { title: 'Price pool', dataIndex: 'pricePool', key: 'pricePool' },
    { title: 'Tags', key: 'tags', render: (text, record) =>  <>
        {record.tags.map((tagId) => <Tag key={tagId}>{tags[tagId].name}</Tag>)}
    </>},
    {
    title: '',
    key: 'actions',
    render: (text, record) => <ButtonGroup>
        <Button  type={record.isFeatured ? 'primary' : undefined} icon='pushpin' onClick={() => onChangeFeature(record.id, !record.isFeatured)} />
        <Popconfirm title="Sure to change main event?" onConfirm={() => onChangeMainEvent(record.id)} okType={'danger'} disabled={record.isMainEvent}>
            <Button type={record.isMainEvent ? 'primary' : undefined} icon='thunderbolt' />
        </Popconfirm>
        <Button icon='edit' onClick={() => onEdit(record)} />
        <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record.id)} disabled={record.events > 0}>
            <Button type="danger" icon='delete' disabled={record.events > 0} />
        </Popconfirm>
    </ButtonGroup>,
    },
];

export default function EventsList(): ReactElement {
    const dispatch = useDispatch();
    const events: Event[] = Object.values(useSelector(eventsSelector)).sort(({start: a}, {start: b}) => b - a);
    const tags = useSelector(tagsSelector);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<null | number>(null);
    const organizerEntities = useSelector(organizerSelector);
    const organizerOptions = useMemo(() => Object.values(organizerEntities), [organizerEntities]);
    const countryList = useMemo(() => Object.entries(getCodeList()).map(([code, name]) => ({code, name})).sort(({name: a}, {name: b}) =>  b > a ? 1 : 0), []);

    console.log(organizerEntities);
    
    useEffect(() => {
        dispatch(loadOrganizer());
        dispatch(loadEvents());
    }, []);

    const onEdit = (event: Event) => {
        setEditId(event.id);
        setName(event.name);
        setOrganizer(event.organizer);
        setShortDescription(event.descriptionShort);
        setStart(event.start);
        setEnd(event.end);
        setCountry(event.country);
        setLocation(event.location);
        setPricePool(event.pricePool);
        setDescription(event.description);
        setDescType(event.descriptionType);
        setDisclaimer(event.disclaimer);
        setBanner(event.banner);
        setOrganizerLogo(event.organizerLogo);
        setShowEditModal(true);
    };

    const onDelete = (id: number) => dispatch(deleteEvent(id));
    const onChangeMainEvent = (id: number) => dispatch(changeMainEvent(id));
    const onChangeFeature = (id: number, feature: boolean) => dispatch(toggleFeature(id, feature));

    const [name, setName] = useState('');
    const [organizer, setOrganizer] = useState<number | null>(null);
    const [shortDescription, setShortDescription] = useState('');
    const [start, setStart] = useState<number | null>(null);
    const [end, setEnd] = useState<number | null>(null);
    const [country, setCountry] = useState('');
    const [location, setLocation] = useState('');
    const [pricePool, setPricePool] = useState('');
    const [description, setDescription] = useState('');
    const [descType, setDescType] = useState('description');
    const [disclaimer, setDisclaimer] = useState('');
    const [banner, setBanner] = useState<File | string | null>(null);
    const [organizerLogo, setOrganizerLogo] = useState<File | string | null>(null);

    const onPatch = async (): Promise<void> => {
        setLoading(true);
        await dispatch(patchEvent(
            editId,
            name,
            organizer,
            shortDescription,
            start,
            end,
            country,
            location,
            pricePool,
            description,
            descType,
            disclaimer,
            banner instanceof File ? banner : null,
            organizerLogo instanceof File ? organizerLogo : null,
        ));
        setLoading(false);
        setShowEditModal(false);
    };

    return <>
        <Table columns={columns(tags, organizerEntities, onEdit, onDelete, onChangeMainEvent, onChangeFeature)} dataSource={events} rowKey={'id'} />
        <Drawer
            title="Edit Event"
            width={1024}
            onClose={() => setShowEditModal(false)}
            visible={showEditModal}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Form {...formItemLayout}>
                <Form.Item label="Name">
                    <Input style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                
                <Form.Item label="Organizer">
                    <Select
                        style={{ width: '100%' }} 
                        loading={organizerOptions.length === 0} 
                        value={organizer} 
                        onChange={(value) => setOrganizer(value)} 
                        showSearch 
                        optionFilterProp={"children"} 
                        filterOption={(input, option) => (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {organizerOptions.map(({id, name}) => <Select.Option key={id} value={id}>
                            {name}
                        </Select.Option>)}
                    </Select>
                </Form.Item>
                
                <Form.Item label="Short description">
                    <Input.TextArea style={{ width: '100%' }} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                </Form.Item>

                <Form.Item label={'Date'}>
                    <DatePicker.RangePicker 
                        defaultValue={[start ? moment.unix(start) : null, end ? moment.unix(end) : null]}
                        format={dateFormat} 
                        onChange={(([startMoment, endMoment]) => {
                            setStart(startMoment ? startMoment.unix() : null);
                            setEnd(endMoment ? endMoment.unix() : null);
                        })}
                    />
                </Form.Item>
                
                <Form.Item label="Country">
                    <Select 
                        style={{ width: '100%' }} 
                        value={country} 
                        onChange={(value) => setCountry(value)} 
                        showSearch 
                        optionFilterProp={"children"} 
                        filterOption={(input, option) => (option.props.children[2] as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {countryList.map(({code, name}) => <Select.Option key={code} value={code}>
                            <ReactCountryFlag countryCode={code} svg /> {name}
                        </Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Location">
                    <Input style={{ width: '100%' }} value={location} onChange={(e) => setLocation(e.target.value)} />
                </Form.Item>

                <Form.Item label="Price pool">
                    <Input style={{ width: '100%' }} value={pricePool} onChange={(e) => setPricePool(e.target.value)} />
                </Form.Item>
                
                <Form.Item label="Description Type">
                    <Select 
                        style={{ width: '100%' }} 
                        value={descType} 
                        onChange={(value) => setDescType(value)} 
                    >
                        <Select.Option value={'description'}>Description</Select.Option>
                        <Select.Option value={'information'}>Information</Select.Option>
                        <Select.Option value={'advice'}>Advice</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Description">
                    <ReactQuill style={{background: '#FFF'}} modules={{
                        toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            ['link', 'image'],
                        ],
                    }} formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image'
                    ]} theme={'snow'} value={description} onChange={(value) => setDescription(value)} />
                </Form.Item>

                <Form.Item label="Disclaimer">
                    <ReactQuill style={{background: '#FFF'}} modules={{
                        toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            ['link', 'image'],
                        ],
                    }} formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image'
                    ]} theme={'snow'} value={disclaimer} onChange={(value) => setDisclaimer(value)}/>
                </Form.Item>

                <Form.Item label="Banner">
                    <FileForm file={banner} setFile={setBanner} />
                </Form.Item>

                <Form.Item label="Organizer Event Logo">
                    <FileForm file={organizerLogo} setFile={setOrganizerLogo} />
                </Form.Item>

                <Button type={'primary'} onClick={onPatch} loading={loading}>
                    <Icon type="calendar" /> Event aktualisieren
                </Button>
            </Form>
        </Drawer>
        <style jsx global>{`
            .ql-toolbar.ql-snow {
                padding: 0px!important;
            }
            .ql-snow .ql-picker.ql-header .ql-picker-label::before {
                position: absolute;
            }
            .ql-editor {
                min-height: 130px;
            }
        `}</style>
    </>;
}