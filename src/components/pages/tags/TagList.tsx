import { ReactElement, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import { Form, Row, Col, Card, Modal, Input } from "antd";
import { loadTags, deleteTag, patchTag } from "../../../store/Tag";
import { useDispatch, useSelector } from "react-redux";
import { tagsSelector } from "../../../store/selectors/tag";
import TextArea from "antd/lib/input/TextArea";
import FileForm from "../../FileForm";

export default function TagList(): ReactElement {
    const dispatch = useDispatch();
    const tags = Object.values(useSelector(tagsSelector)).sort(({id: a}, {id: b}) => b - a);

    useEffect(() => {
        dispatch(loadTags());
    },[]);

    const [showImageModal, setImageShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | string | null>(null);
    const [loading, setLoading] = useState(false);

    const onAddImage = (id: number) => {
        setId(id);
        setImageShowModal(true);
    };
    
    const onEdit = (id: number, name: string, description: string, slug: string, image: string) => {
        setId(id);
        setName(name);
        setDescription(description);
        setImage(image);
        setSlug(slug);
        setShowEditModal(true);
    };

    const onPatchImage = async () => {
        if(image) {
            setLoading(true);
            await dispatch(patchTag(id, null, null, null, image));
            setLoading(false);
        }
        setImage(null);
        setId(null);
        setSlug(null);
        setImageShowModal(false);
    };

    const onPatchTag = async () => {
        if(name) {
            setLoading(true);
            await dispatch(patchTag(id, name, description, slug, image));
            setLoading(false);
        }
        setName('');
        setDescription('');
        setSlug('');
        setId(null);
        setShowEditModal(false);
    };

    return (
        <Row justify="start" gutter={[16, 16]}>
            {tags.map(({id, name, description, image, slug}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
                <Card
                    actions={[
                        ...(!image ? [<div onClick={() => onAddImage(id)}><PictureOutlined /> Bild</div>] : []),
                        <div onClick={() => onEdit(id, name, description, slug, image)}><EditOutlined /> Editieren</div>,
                        <div onClick={() => dispatch(deleteTag(id))}><DeleteOutlined /> Löschen</div>,
                    ]} 
                    cover={<img alt={`tag-${name}`} src={`${process.env.API_URL}${image}`} height={200} style={{objectFit: 'cover'}}/>}>
                    <Card.Meta title={name} description={description || ' '} />
                </Card>
            </Col>)}

            <Modal title="Neues Bild" visible={showImageModal} onOk={onPatchImage} onCancel={() => setImageShowModal(false)} confirmLoading={loading}>
                <FileForm file={image} setFile={setImage} label={'Tag Image'} />
            </Modal>

            <Modal title="Tag bearbeiten" visible={showEditModal} onOk={onPatchTag} onCancel={() => setShowEditModal(false)} confirmLoading={loading}>
                <Form layout={'vertical'}>
                    <Input id="name" placeholder={'Name'} type="text" value={name} onChange={({target}) => setName(target.value)}/>
                    <TextArea placeholder={'Beschreibung'} id="description" value={description} onChange={({target}) => setDescription(target.value)}/>
                    <Input id="slug" placeholder={'Slug'} type="text" value={slug} onChange={({target}) => setSlug(target.value)}/>
                    <FileForm file={image} setFile={setImage} label={'Tag Bild'} />
                </Form>
            </Modal>
        </Row>
    );
}