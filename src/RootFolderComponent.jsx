import { useEffect, useState } from 'react';
import axios from 'axios';
import "./rootfolder.css";
import WordIcon from "./assets/icon-word.svg"
import FolderIcon from "./assets/icon-folder.svg"
import PdfIcon from "./assets/icon-pdf.svg"
import ExcelIcon from "./assets/icon-excel.svg"



function RootFolderComponent() {
  const [rootFolderData , setRootFolderData] = useState({childs:[]});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [currentFolderPath, setCurrentFolderPath] = useState([]);

  useEffect(() => {
    console.log(import.meta.env.VITE_REACT_APP_JWT)
    // .env dosyasının doğru bir şekilde içeri aktarılmasının kontrolü
    const jwtToken = import.meta.env.VITE_REACT_APP_JWT;

    // API isteği için gerekli URL
    const apiUrl = 'https://dmstest.hexaworks.com/viewstore?pagenumber=1&countperpage=50';

    // axios kullanarak api isteği gönderme
    axios.get(apiUrl, {
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
        "Access-Control-Allow-Origin": "http://localhost:5175/",
        "Access-Control-Allow-Methods": [
          "POST",
          "GET",
          "OPTIONS",
          "DELETE",
          "PUT",
        ],
        "Access-Control-Allow-Headers": [
          "append",
          "delete",
          "entries",
          "foreach",
          "get",
          "has",
          "keys",
          "set",
          "values",
          "Origin",
          "Content-Type",
          "X-Auth-Token"
        ],
        
      },
    })
    .then((response) => {
      // API dönen veri kontrolü için console.log atılması
      const responseData = response.data
      setRootFolderData(responseData);
      console.log('API Verileri:', responseData);
    })
    .catch((error) => {
      // Hata durumunda sorunun nereden kaynaklandığını bulabilmemiz için catch
      console.error('API Hatası:', error);
    });
  }, []);


  //Eklenmek istenen dosyayı eklemek için kullanılan fonksiyon
  const addFileToFolder = (folder) => {
    if (selectedFile && folder.extension === 'folder') {
      const newFileItem = {
        id: `f${Date.now()}`,
        name: selectedFile.name,
        isFolder: false,
        extension: fileType,
      };

      folder.portfolios = [...(folder.portfolios || []), newFileItem];

      setRootFolderData((prevData) => ({
        ...prevData,
        childs: prevData.childs.map((item) =>
          item.id === folder.id ? folder : item
        ),
      }));

      // Seçilen dosyayı temizleyin
      setSelectedFile(null);
      setFileType(null);
    }
  };

      

  const handleFileInputChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const fileExtension = newFile.name.split(".").pop().toLowerCase();
      setSelectedFile(newFile);
      setFileType(fileExtension);
      addFileToFolder(currentFolderPath[currentFolderPath.length -1]); // Seçilen dosyayı eklemek istenen klasöre ekleyin
    }
  };

  // Dosya eklemek istenen klasörün yoluyla güncelleme
  const handleFileAddClick = (item) => {
    setCurrentFolderPath([...currentFolderPath, item]);

    // Dosya seçme işlemini otomatik olarak başlatmak için fonksiyon
    document.querySelector('input[type="file"]').click();
  };

 
  const renderTree = (data) => {
    return (
      <ul className="tree">
        {data.childs.map((item) => (
          <li key={item.id}>
            <details>
              <summary>
              {item.isFolder && (
                  <button onClick={() => handleFileAddClick(item)}>+</button>
                )}
                {/* Dosya türüne göre uygun SVG simgesini kullanmı */}
                {item.isFolder ? (
                  <img src={FolderIcon} alt="Folder Icon" />
                  ) : item.extension === 'pdf' ? (
                    <img src={PdfIcon} alt="PDF Icon" />
                    ) : item.extension === 'docx' ? (
                      <img src={WordIcon} alt="Word Icon" />
                      ) :  item.extension === 'xlsx'  (
                        <img src={ExcelIcon} alt="Excel Icon" />
                        )}
                {item.name}
                </summary>
              {item.isFolder && item.portfolios && item.portfolios.length > 0 && (
                <ul>
                  {item.portfolios.map((portfolio) => (
                    <li key={portfolio.id}>
                      {portfolio.extension === 'folder' ? (
                        <button onClick={() => handleFileAddClick(portfolio)}>+</button>
                      ) : null}
                      {portfolio.name}
                    </li>
                  ))}
                </ul>
              )}
              {item.childs && renderTree(item)} 
            </details>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div>
    {renderTree(rootFolderData)}
    <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
</div>

  );
}

export default RootFolderComponent;
