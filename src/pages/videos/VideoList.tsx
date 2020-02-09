import { ReactElement, useEffect, useState } from "react";
import { Row, Col, Card, Icon, Modal, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadVideos, deleteVideo, patchVideo } from "../../store/Video";
import { videoSelector } from "../../store/selectors/video";

export default function VideoList(): ReactElement {
    const dispatch = useDispatch();
    const videos = useSelector(videoSelector);

    useEffect(() => {
        dispatch(loadVideos());
    },[]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    
    const onEdit = (id: number, title: string) => {
        setId(id);
        setTitle(title);
        setShowEditModal(true);
    };

    const onPatchVideo = async () => {
        if(title) {
            setLoading(true);
            await dispatch(patchVideo(id, title));
            setLoading(false);
        }
        setTitle('');
        setId(null);
        setShowEditModal(false);
    };

    return <Row type="flex" justify="start" gutter={[16, 16]}>
        {Object.values(videos).map(({id, title, thumbnail}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
            <Card
                actions={[
                    <div onClick={() => onEdit(id, title)}><Icon type="edit" /> Edit</div>,
                    <div onClick={() => dispatch(deleteVideo(id))}><Icon type="delete" /> Delete</div>,
                ]} 
                cover={<img alt={`video-${name}`} src={`${process.env.API_URL}${thumbnail}`} height={200} style={{objectFit: 'cover'}}/>}>
                <Card.Meta title={title} />
            </Card>
        </Col>)}


        <Modal title="Edit video" visible={showEditModal} onOk={onPatchVideo} onCancel={() => setShowEditModal(false)} confirmLoading={loading}>
            <Form layout={'vertical'}>
                <Form.Item label={'Titel'}>
                    <Input id="name" type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
                </Form.Item>´
            </Form>
        </Modal>
    </Row>;
}