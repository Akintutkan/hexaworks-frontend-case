import { useState } from "react";

// eslint-disable-next-line react/prop-types
const DragAndDrop = ({ onFileDrop}) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fileExtension = droppedFile.name.split(".").pop().toLowerCase();
      setFile(droppedFile);
      setFileType(fileExtension);
      onFileDrop(droppedFile, fileExtension);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        width: "300px",
        height: "200px",
        border: "2px dashed #ccc",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {file ? (
        <div>
          <p>Yüklenen Dosya: {file.name}</p>
          <p>Uzantı: {fileType}</p>
        </div>
      ) : (
        <p>Dosyayı sürükleyip bırakın veya tıklayın.</p>
      )}
    </div>
  );
};

export default DragAndDrop;