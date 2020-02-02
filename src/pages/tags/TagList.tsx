import { ReactElement, useEffect, useState } from "react";
import { Row, Col, Card, Icon, Modal, Input, Form } from "antd";
import { loadTags, deleteTag, patchTag } from "../../store/Tag";
import { useDispatch, useSelector } from "react-redux";
import { tagsSelector } from "../../store/selectors/tag";
import TextArea from "antd/lib/input/TextArea";

export default function TagList(): ReactElement {
    const dispatch = useDispatch();
    const tags = useSelector(tagsSelector);

    useEffect(() => {
        dispatch(loadTags());
    },[]);

    const [showImageModal, setImageShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const onAddImage = (id: number) => {
        setId(id);
        setImageShowModal(true);
    };
    
    const onEdit = (id: number, name: string, description: string) => {
        setId(id);
        setName(name);
        setDescription(description);
        setShowEditModal(true);
    };

    const onPatchImage = async () => {
        if(image) {
            setLoading(true);
            await dispatch(patchTag(id, null, null, image));
            setLoading(false);
        }
        setImage(null);
        setId(null);
        setImageShowModal(false);
    };

    const onPatchTag = async () => {
        if(name) {
            setLoading(true);
            await dispatch(patchTag(id, name, description));
            setLoading(false);
        }
        setName('');
        setDescription('');
        setId(null);
        setShowEditModal(false);
    };

    return <Row type="flex" justify="start" gutter={[16, 16]}>
        {Object.values(tags).map(({id, name, description, image}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
            <Card
                actions={[
                    ...(!image ? [<div onClick={() => onAddImage(id)}><Icon type="picture" /> Image</div>] : []),
                    <div onClick={() => onEdit(id, name, description)}><Icon type="edit" /> Edit</div>,
                    <div onClick={() => dispatch(deleteTag(id))}><Icon type="delete" /> Delete</div>,
                ]} 
                cover={<img alt={`tag-${name}`} src={`${process.env.API_URL}${image}`} height={200} style={{objectFit: 'cover'}}/>}>
                <Card.Meta title={name} description={description || ' '} />
            </Card>
        </Col>)}

        <Modal title="Add tag image" visible={showImageModal} onOk={onPatchImage} onCancel={() => setImageShowModal(false)} confirmLoading={loading}>
            <Input accept="image/*" id="image" type="file" onChange={({target}) => setImage(target.files[0])}/>
        </Modal>

        <Modal title="Edit tag" visible={showEditModal} onOk={onPatchTag} onCancel={() => setShowEditModal(false)} confirmLoading={loading}>
            <Form layout={'vertical'}>
                <Form.Item label={'Name'}>
                    <Input id="name" type="text" value={name} onChange={({target}) => setName(target.value)}/>
                </Form.Item>
                <Form.Item label={'Description'}>
                    <TextArea id="description" value={description} onChange={({target}) => setDescription(target.value)}/>
                </Form.Item>
            </Form>
        </Modal>
    </Row>;
}