import { ReactElement } from "react";
import { List, Avatar, Icon } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { articlesSelector } from "../../store/selectors/article";
import { Article, publishArticle, unpublishArticle } from "../../store/Article";
import { AuthorEntities } from "../../store/Author";
import { authorEntitiesSelector } from "../../store/selectors/author";


const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );
  

export default function ArticleList(): ReactElement {
    const articles: Article[] = Object.values(useSelector(articlesSelector));
    const authorEntities: AuthorEntities = useSelector(authorEntitiesSelector);
    const dispatch = useDispatch();

    const togglePublishStatus = (articleId: number, status: string): void => {
        if(status !== 'published') {
            dispatch(publishArticle(articleId));
        } else {
            dispatch(unpublishArticle(articleId));
        }
    };

    return <List
        itemLayout="vertical"
        size="large"
        pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 3,
        }}
        dataSource={articles}
        renderItem={item => {
            const author = authorEntities[item.author];

            return <List.Item 
                key={item.id}
                extra={<img width={512} alt="logo" src={`http://localhost${item.cover}`}/>}
                actions={[
                    <IconText type="edit" text="Edit" key="edit" />,
                    <div onClick={() => togglePublishStatus(item.id, item.status)}><IconText type="global" text={item.status !== 'published' ? 'Publish' : 'Unpublish'} key="list-vertical-like-o" /></div>,
                ]}
            >
                <List.Item.Meta
                    avatar={<Avatar src={`http://localhost${author.avatar}`} size={'large'} />}
                    title={item.title}
                    description={`${author.name} - ${item.created}`}
                />
                <div dangerouslySetInnerHTML={{__html: item.body}} />
            </List.Item>;
        }}
  />;
}