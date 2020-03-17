import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import { CalendarOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, DatePicker, Button, Row, Col, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EventLink } from '../../../@types/Entities/Event';
import { loadOrganizer } from '../../../store/Organizer';
import { organizerSelector } from '../../../store/selectors/organizer';
import { getCodeList } from 'country-list';
import ReactCountryFlag from "react-country-flag"
import TagsForm from '../../TagsForm';
import FileForm from '../../FileForm';
import { createEvent } from '../../../store/Events';
import TextEditor from '../../TextEditor';
import dayjs from 'dayjs';

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

interface Props {
    closeCallback?: () => void;
}

export function EditLink({link, setLink, del}: {link: Partial<EventLink>; setLink: (l: Partial<EventLink>) => void; del: () => void}): ReactElement {
    return (
        <Row gutter={[20, 0]} align={'middle'}>
            <Col span={7}>
                <Form.Item>
                    <Input placeholder={'Name'} value={link.name} onChange={(e) => setLink({name: e.target.value})} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item>
                    <Select value={link.linkType} onChange={(value) => setLink({linkType: value})}>
                        <Select.Option value={'homepage'}>Homepage</Select.Option>
                        <Select.Option value={'liquipedia'}>Liquipedia</Select.Option>
                        <Select.Option value={'custom'}>Other</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item>
                    <Input placeholder={'Link'} value={link.link} onChange={(e) => setLink({link: e.target.value})} />
                </Form.Item>
            </Col>
            <Col span={1}>
                <Popconfirm title="Sure to remove link?" onConfirm={del}>
                    <DeleteOutlined />
                </Popconfirm>
            </Col>
        </Row>
    );
}

export default function AddEventForm({closeCallback = () => {}}: Props): ReactElement {
    const dispatch = useDispatch();
    const organizerEntities = useSelector(organizerSelector);
    const organizerOptions = useMemo(() => Object.values(organizerEntities), [organizerEntities]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(loadOrganizer());
    }, [])

    const countryList = useMemo(() => Object.entries(getCodeList()).map(([code, name]) => ({code, name}))
                                                                   .concat([{code: 'eu', name: 'Europe'}, {code: 'xx', name: 'Online'}])
                                                                   .sort(({name: a}, {name: b}) =>  b > a ? 1 : 0), []);

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
    const [slug, setSlug] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [links, setLinks] = useState<Partial<EventLink>[]>([]);
    const [banner, setBanner] = useState<File | string | null>(null);
    const [organizerLogo, setOrganizerLogo] = useState<File | string | null>(null);

    const onCreate = async (): Promise<void> => {
        if(organizer && name) {
            setLoading(true);
            await dispatch(createEvent(
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
                tags,
                links,
                banner instanceof File ? banner : null,
                organizerLogo instanceof File ? organizerLogo : null,
                slug,
            ));
            setLoading(false);
            setName('');
            setOrganizer(null);
            setShortDescription('');
            setStart(null);
            setEnd(null);
            setCountry('');
            setLocation('');
            setPricePool('');
            setDescription('');
            setDescType('description');
            setDisclaimer('');
            setTags([]);
            setLinks([]);
            setBanner(null);
            setOrganizerLogo(null);
            setSlug('');
            closeCallback();
        };
    };

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Name">
                <Input style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            
            <Form.Item label="Veranstalter">
                <Select 
                    style={{ width: '100%' }} 
                    loading={organizerOptions.length === 0} 
                    value={organizer} 
                    onChange={(value) => setOrganizer(value)} 
                    showSearch 
                    optionFilterProp={"children"} 
                    filterOption={(inputValue, option) => option.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    {organizerOptions.map(({id, name}) => <Select.Option key={id} value={id}>
                        {name}
                    </Select.Option>)}
                </Select>
            </Form.Item>
            
            <Form.Item label="Kurzbeschreibung">
                <Input.TextArea style={{ width: '100%' }} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
            </Form.Item>

            <Form.Item label={'Datum'}>
                <DatePicker.RangePicker 
                    //@ts-ignore
                    defaultValue={[start ? dayjs.unix(start) : null, end ? dayjs.unix(end) : null]}
                    format={dateFormat} 
                    onChange={(([startMoment, endMoment]) => {
                        setStart(startMoment ? startMoment.unix() : null);
                        setEnd(endMoment ? endMoment.unix() : null);
                    })}
                />
            </Form.Item>
            
            <Form.Item label="Land">
                <Select 
                    style={{ width: '100%' }} 
                    value={country} 
                    onChange={(value) => setCountry(value)} 
                    showSearch 
                    optionFilterProp={"children"} 
                    filterOption={(input, option) => (option.props.children[2] as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {countryList.map(({code, name}) => <Select.Option key={code} value={code}>
                        {code === 'xx' ? <div className={'onlineFlag'} /> : <ReactCountryFlag countryCode={code} svg />}  {name}
                    </Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item label="Ort">
                <Input style={{ width: '100%' }} value={location} onChange={(e) => setLocation(e.target.value)} />
            </Form.Item>

            <Form.Item label="Preispool">
                <Input style={{ width: '100%' }} value={pricePool} onChange={(e) => setPricePool(e.target.value)} />
            </Form.Item>
            
            <Form.Item label="Beschreibungstyp">
                <Select 
                    style={{ width: '100%' }} 
                    value={descType} 
                    onChange={(value) => setDescType(value)} 
                >
                    <Select.Option value={'description'}>Beschreibung</Select.Option>
                    <Select.Option value={'information'}>Information</Select.Option>
                    <Select.Option value={'advice'}>Hinweis</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Beschreibung">
                <TextEditor text={description} setText={setDescription} />
            </Form.Item>

            <Form.Item label="Disclaimer">
                <TextEditor text={disclaimer} setText={setDisclaimer} />
            </Form.Item>

            <TagsForm tags={tags} setTags={setTags} />

            <Form.Item label='Links'>
                {/* //@ts-ignore */}
                {links.map((link, index) => <EditLink 
                    key={index} 
                    del={() => setLinks(links.filter((dLink) => dLink.name !== link.name || dLink.linkType !== link.linkType || dLink.link !== link.link))} 
                    link={link} 
                    setLink={(linkData) => setLinks(links.map((oldLink, oldIndex) => {
                        if(index === oldIndex) {
                            return {...oldLink, ...linkData};
                        }
                        return oldLink;
                    }))}/>)}

              <Button type="dashed" style={{ width: '60%' }} onClick={() => setLinks([...links, {name: '', link: '', linkType: 'custom'}])}>
                <PlusOutlined /> Add link
              </Button>
            </Form.Item>

            <Form.Item label="Banner">
                <FileForm file={banner} setFile={setBanner} />
            </Form.Item>

            <Form.Item label="Veranstatler Logo">
                <FileForm file={organizerLogo} setFile={setOrganizerLogo} />
            </Form.Item>

            <Form.Item label="Slug">
                <Input style={{ width: '100%' }} value={slug} onChange={(e) => setSlug(e.target.value)} />
            </Form.Item>

            <Button type={'primary'} onClick={onCreate} loading={loading}>
                <CalendarOutlined /> Event erstellen
            </Button>

            <style jsx>{`
                .onlineFlag {
                    width: 14px;
                    height: 12px;
                    background-color: #BBB;
                    display: inline-block;
                    vertical-align: -.1em;
                }    
            `}</style>
        </Form>
    );
}
