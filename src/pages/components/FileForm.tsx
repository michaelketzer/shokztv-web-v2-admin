import { ReactElement, useMemo } from "react";
import { Upload } from "antd";

interface Props {
  label?: string;
  file: File;
  setFile: (file: File) => void;
}

export default function FileForm({label = 'Upload', file, setFile}: Props): ReactElement {
  const src = useMemo(() => {
    if(file) {
      return URL.createObjectURL(file);
    }

    return null;
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