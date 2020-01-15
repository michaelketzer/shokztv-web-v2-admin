import { ReactElement, useEffect } from "react";
import { Row, Col, Card } from "antd";
import { loadTags } from "../../store/Tag";
import { useDispatch, useSelector } from "react-redux";
import { tagsSelector } from "../../store/selectors/tag";

export default function TagList(): ReactElement {
    const dispatch = useDispatch();
    const tags = useSelector(tagsSelector);

    useEffect(() => {
        dispatch(loadTags());
    },[]);


    return <Row type="flex" justify="start" gutter={[16, 16]}>
        {Object.values(tags).map(({id, name, image}) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={id}>
            <Card cover={<img alt={`tag-${name}`} src={`http://localhost${image}`} height={200} style={{objectFit: 'cover'}}/>}>
                <Card.Meta title={name} />
            </Card>
        </Col>)}
    </Row>;
}