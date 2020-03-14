import { ReactElement, useEffect, useState, useMemo } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Row, Col, Card, Modal, Input, Pagination, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadVideos, deleteVideo, patchVideo } from "../../../store/Video";
import { videoSelector } from "../../../store/selectors/video";

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

    const [page, setPage] = useState(1);

    const filteredItems = useMemo(() => videos.slice((page - 1) * 10, page * 10), [page, videos]);

    return (
        <>
            <Pagination current={page} onChange={(p) => setPage(p)} total={videos.length}/>

            <Divider />

            <Row justify="start" gutter={[16, 16]}>
                {filteredItems.map(({id, title, thumbnail}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
                        <Card
                            actions={[
                                <div onClick={() => onEdit(id, title)}><EditOutlined /> Edit</div>,
                                <div onClick={() => dispatch(deleteVideo(id))}><DeleteOutlined /> Delete</div>,
                            ]} 
                            cover={<img alt={`video-${name}`} src={`${process.env.API_URL}${thumbnail}`} height={200} style={{objectFit: 'cover'}}/>}>
                            <Card.Meta title={title} />
                        </Card>
                </Col>)}
            </Row>

            <Modal title="Video bearbeiten" visible={showEditModal} onOk={onPatchVideo} onCancel={() => setShowEditModal(false)} confirmLoading={loading}>
                <Input id="name" type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
            </Modal>
        </>
    );
}