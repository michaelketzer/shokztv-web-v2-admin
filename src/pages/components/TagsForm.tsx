import React, { ReactElement, useState, useMemo, useEffect } from 'react';
import { Form, Input, Icon, Tag, AutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { tagsSelector } from '../../store/selectors/tag';
import { loadTags } from '../../store/Tag';

interface Props {
    tags: string[];
    setTags: (t: string[]) => void;
}

export default function TagsForm({tags, setTags}: Props): ReactElement {
    const dispatch = useDispatch();
    const [tagInput, setTagInput] = useState(false);
    const [newTagInput, setNewTagInput] = useState('');
    const availableTags = useSelector(tagsSelector);
    const autoCompleteTags = useMemo(() => [...(new Set(Object.values(availableTags).map((tag) => tag.name))).values()].filter((tag) => !tags.includes(tag)), [availableTags]);

    useEffect(() => {
        dispatch(loadTags());
    }, []);

    const addTag = (e) => {
        if(e.target.value.length) {
            setTags([...(new Set([...tags, e.target.value])).values()]);
            setNewTagInput('');
            setTagInput(false);
        }
    };
    const removeTag = (tag) => setTags([...tags.filter((t) => t !== tag)]);

    return <Form.Item label="Tags">
        {tags.map((tag) => <Tag key={tag} closable={true} onClose={() => removeTag(tag)}>
            {tag.length > 20 ? `${tag.slice(0, 20)}...` : tag}
        </Tag>)}

        {tagInput && (
        <AutoComplete 
            dataSource={autoCompleteTags}
            style={{ width: 100 }} 
            size="small" 
            onSelect={(value) => setNewTagInput(value as string)} 
            filterOption={(inputValue, option) => (option.props.children as string).indexOf(inputValue) !== -1}>
            <Input
                type="text"
                size="small"
                style={{ width: 100 }}
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onBlur={addTag}
                onPressEnter={addTag}
            />
        </AutoComplete>
        )}
        {!tagInput && (
        <Tag onClick={() => setTagInput(true)} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
        </Tag>
        )}
    </Form.Item>;
}
