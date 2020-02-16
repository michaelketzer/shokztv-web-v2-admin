import { ReactElement, useMemo } from "react";
import { Upload } from "antd";
import { stringify } from "querystring";

interface Props {
  label?: string;
  file: File | string | null;
  setFile: (file: File) => void;
}

export default function FileForm({label = 'Upload', file, setFile}: Props): ReactElement {
  const src = useMemo(() => {
    if(file instanceof File) {
      return URL.createObjectURL(file);
    }
    if(typeof file === 'string') {
      return process.env.API_URL + file;
    }

    return file;
  }, [file]);

  return <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={(file) => {
          setFile(file);
          return false;
      }}
    >
    {src ? <img src={src} alt="avatar" style={{ width: '100%' }} /> : <div>
      <div className="ant-upload-text">{label}</div>
    </div>}
  </Upload>;
}