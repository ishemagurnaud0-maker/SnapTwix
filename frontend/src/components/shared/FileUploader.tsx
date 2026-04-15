import { useCallback,useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/Button'

interface FileUploaderProps {
    fieldChange: (files: File[]) => void;
    mediaUrl?: string | null;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl || '');
    const [fileType, setFileType] = useState<string>('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles);
        if (acceptedFiles.length > 0) {
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
            // Detect file type
            const fileType = acceptedFiles[0].type.startsWith('video/') ? 'video' : 'image';
            setFileType(fileType);
        }
    }, [file]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
        }
        
    });
    
  return (
    <>
    <div {...getRootProps()} className='flex flex-col flex-center bg-dark-2 rounded-xl cursor-pointer hover:bg-dark-4 transition-all duration-300'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {fileUrl? (
        <>
            <div className='flex flex-1 justify-center p-5 w-full lg:p-10'>
              {fileType === 'video' ? (
                <video src={fileUrl} controls className='file_uploader-img' />
              ) : (
                <img src={fileUrl} alt='Uploaded image' className='file_uploader-img'/>
              )}
            </div>
            <p className='file_uploader-label'>Drag and drop or click to replace {fileType === 'video' ? 'video' : 'image'}.</p>
        </>
        
      ) : (
        <div className='file_uploader-box'>
            <img src='/assets/icons/file-upload.svg' alt="file-upload" width={96} height={77}/>
            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag your photos and videos here</h3>
            <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG, MP4, MOV</p>

            <Button type="button" className='shad-button_dark_4'>Select from your device</Button>

        </div>
    
      )}
  </div>
  </>
  )
}

export default FileUploader