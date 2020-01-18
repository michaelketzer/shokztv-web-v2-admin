import { ReactElement, useEffect, useState } from "react";
import { Row, Col, Card, Icon, Modal, Input } from "antd";
import { loadTags, deleteTag, patchTag } from "../../store/Tag";
import { useDispatch, useSelector } from "react-redux";
import { tagsSelector } from "../../store/selectors/tag";

export default function TagList(): ReactElement {
    const dispatch = useDispatch();
    const tags = useSelector(tagsSelector);

    useEffect(() => {
        dispatch(loadTags());
    },[]);

    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const onEdit = (id: number) => {
        setId(id);
        setShowModal(true);
    };

    const onPatch = async () => {
        if(image) {
            setLoading(true);
            await dispatch(patchTag(id, null, image));
            setLoading(false);
        }
        setImage(null);
        setId(null);
        setShowModal(false);
    };

    return <Row type="flex" justify="start" gutter={[16, 16]}>
        {Object.values(tags).map(({id, name, image}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
            <Card
                actions={[
                    ...(!image ? [<div onClick={() => onEdit(id)}><Icon type="picture" /> Image</div>] : []),
                    <div onClick={() => dispatch(deleteTag(id))}><Icon type="delete" /> Delete</div>,
                ]} 
                cover={<img alt={`tag-${name}`} src={`${process.env.API_URL}${image}`} height={200} style={{objectFit: 'cover'}}/>}>
                <Card.Meta title={name} />
            </Card>
        </Col>)}

        <Modal title="Patch Tag" visible={showModal} onOk={onPatch} onCancel={() => setShowModal(false)} confirmLoading={loading} >
            <Input accept="image/*" id="image" type="file" onChange={({target}) => setImage(target.files[0])}/>
        </Modal>
    </Row>;
}