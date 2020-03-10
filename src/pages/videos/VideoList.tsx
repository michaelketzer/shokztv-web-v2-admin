import { ReactElement, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Modal, Input, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadVideos, deleteVideo, patchVideo } from "../../store/Video";
import { videoSelector } from "../../store/selectors/video";

export default function VideoList(): ReactElement {
    const dispatch = useDispatch();
    const videos = Object.values(useSelector(videoSelector)).sort(({id: a}, {id: b}) => b - a);

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

    return (
        <Row type="flex" justify="start" gutter={[16, 16]}>
            <List
            itemLayout="horizontal"
            size="large"
            pagination={{
                pageSize: 10,
                position: 'top'
            }}
            dataSource={videos}
            renderItem={(({id, title, thumbnail}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
                    <Card
                        actions={[
                            <div onClick={() => onEdit(id, title)}><EditOutlined /> Edit</div>,
                            <div onClick={() => dispatch(deleteVideo(id))}><DeleteOutlined /> Delete</div>,
                        ]} 
                        cover={<img alt={`video-${name}`} src={`${process.env.API_URL}${thumbnail}`} height={200} style={{objectFit: 'cover'}}/>}>
                        <Card.Meta title={title} />
                    </Card>
                </Col>)}
            />


            <Modal title="Edit video" visible={showEditModal} onOk={onPatchVideo} onCancel={() => setShowEditModal(false)} confirmLoading={loading}>
                <Form layout={'vertical'}>
                    <Form.Item label={'Titel'}>
                        <Input id="name" type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
                    </Form.Item>´
                </Form>
            </Modal>
        </Row>
    );
}