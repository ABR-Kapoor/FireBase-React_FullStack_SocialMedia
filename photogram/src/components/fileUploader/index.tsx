import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileUploaderRegular,
  OutputFileEntry,
  OutputCollectionState,
  OutputCollectionStatus,
  UploadCtxProvider,
} from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { FileEntry } from "../../types";

interface IFileUploaderProps {
  fileEntry: FileEntry;
  onChange: (updated: FileEntry) => void;
  theme?: "light" | "dark";
  preview?: boolean;
}

const FileUploader: React.FC<IFileUploaderProps> = ({
  fileEntry,
  onChange,
  theme = "light",
  preview,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    OutputFileEntry<"success">[]
  >(fileEntry.files || []);
  const ctxRef = useRef<UploadCtxProvider>(null);

  // Sync internal state when prop changes
  useEffect(() => {
    setUploadedFiles(fileEntry.files || []);
  }, [fileEntry]);

  // Optional: clear on mount
  useEffect(() => {
    ctxRef.current?.uploadCollection.clearAll();
  }, []);

  const handleChange = useCallback(
    (
      state: OutputCollectionState<OutputCollectionStatus, "maybe-has-group">
    ) => {
      const success = state.allEntries.filter(
        (f): f is OutputFileEntry<"success"> => f.status === "success"
      );
      setUploadedFiles(success);
      onChange({ files: success });
      console.log(
        "Uploaded Files:",
        success.map((f) => ({ name: f.name, cdnUrl: f.cdnUrl, uuid: f.uuid }))
      );
    },
    [onChange]
  );

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry["uuid"]) =>
      onChange({ files: fileEntry.files.filter((f) => f.uuid !== uuid) }),
    [fileEntry.files, onChange]
  );

  return (
    <div className={`file-uploader theme--${theme}`}>
      <FileUploaderRegular
        ref={ctxRef}
        value={uploadedFiles}
        onChange={handleChange}
        removeCopyright={true}
        pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY}
        multiple={preview}
        imgOnly={true}
        sourceList="local,camera,facebook,gdrive"
        cloudImageEditorAutoOpen={false}
        classNameUploader={`uc-${theme} uc-orange`}
      />

      {preview ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {uploadedFiles.map((file) => (
            <div className="relative" key={file.uuid}>
              <img
                src={`${file.cdnUrl}/-/format/webp/-/quality/smart/`}
                alt={file.name}
                className="w-full rounded-3xl"
              />
              <button
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white border-1 border-black rounded-full text-slate-800"
                type="button"
                onClick={() => handleRemoveClick(file.uuid)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FileUploader;
