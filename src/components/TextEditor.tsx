import { ReactElement } from "react";
const CKEditor = typeof window === 'object' ? require('@ckeditor/ckeditor5-react') : () => false;
const ClassicEditor = typeof window === 'object' ? require('@ckeditor/ckeditor5-build-classic') : () => false;

interface Props {
    text: string;
    setText: (t: string) => void;
}

export default function TextEditor({text, setText}: Props): ReactElement {
    return <CKEditor
        editor={ ClassicEditor }
        data={text}
        onChange={ ( event, editor ) => {
            const data = editor.getData();
            setText(data);
            console.log( { event, editor, data } );
        } }
    />
}