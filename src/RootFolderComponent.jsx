import { useEffect, useState } from 'react';
import axios from 'axios';
import "./rootfolder.css";
import WordIcon from "./assets/icon-word.svg"
import FolderIcon from "./assets/icon-folder.svg"
import PdfIcon from "./assets/icon-pdf.svg"
import ExcelIcon from "./assets/icon-excel.svg"
import DefaultIcon from "./assets/icon-excel.svg"
import CheckIcon from "./assets/icon-check.svg"
// import { getItemFromLocalStorage, setItemInLocalStorage } from "../src/utils/localStorageUtils"



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

  
  // const updateAndSaveToLocalStorage = (updatedData) => {
  //   setRootFolderData(updatedData);
  //   setItemInLocalStorage('rootFolderData', updatedData);
  // };
  // const handleUpdateButtonClick = () => {
  //   const currentData = getItemFromLocalStorage('rootFolderData');
  //   updateAndSaveToLocalStorage(currentData);
  // };



  
  const addFileToFolder = (folder) => {
    if (selectedFile && folder.extension === 'folder') {
      const newFileItem = {
        name: selectedFile.name,
        id: `f${Date.now()}`,
        userCanAccess: true,
        isFolder: false,
        extension: fileType,
        icon: getFileIcon(fileType),
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
      setCurrentFolderPath([...currentFolderPath]);
   
    }
  };
  
  const getFileIcon = (extension) => {
    switch (extension) {
      case 'pdf':
        return <img src={PdfIcon} alt="PDF Icon" />;
      case 'docx':
        return <img src={WordIcon} alt="Word Icon" />;
      case 'xlsx':
        return <img src={ExcelIcon} alt="Excel Icon" />;
        case 'folder':
        return <img src={FolderIcon} alt="Folder Icon" />;
      default:
        return <img src={DefaultIcon} alt="Default Icon" />;
    }
  };

      

  const handleFileInputChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const fileNameWithoutExtension = newFile.name.replace(/\.[^/.]+$/, "");
      setSelectedFile({
        name: fileNameWithoutExtension, // Dosya adı uzantısız olarak ayarlandı
        file: newFile, // Dosya kendisi saklanıyor
      });
      const fileExtension = newFile.name.split(".").pop().toLowerCase();
      setFileType(fileExtension);
      addFileToFolder(currentFolderPath[currentFolderPath.length - 1]);
    }
  };

  // Dosya eklemek istenen klasörün yoluyla güncelleme
  const handleFileAddClick = (item) => {
    setCurrentFolderPath([...currentFolderPath, item]);
    addFileToFolder(item)
    // Dosya seçme işlemini otomatik olarak başlatmak için fonksiyon
    
    document.querySelector('input[type="file"]').value=""
  };

  
  

  const renderTree = (data) => {
    return (
      <ul className="tree">
        {data.childs?.map((item) => (
          <li key={item.id}>
            <details>
              <summary>
               {getFileIcon(item.extension)}{item.name}
                </summary>
                {/* {item.isFolder && (
  <>
    
    {item.objectType === "folder" && (
      <button onClick={handleUpdateButtonClick}>Kaydet</button>
    )}
  </>
)} */}
              {item.isFolder && item.portfolios && item.portfolios.length > 0 && (
                <ul>
                  {item.portfolios.map((portfolio) => (
                  <li key={portfolio.id}>
                      <div>{getFileIcon(portfolio.extension)} {portfolio.name}</div>
                    </li>
                  ))}
                  <li>
                    <div>
                      <input type="file"onChange={handleFileInputChange}/>
                <button onClick={() => handleFileAddClick(item)}><img src={CheckIcon} alt=""/></button>
                    </div>
                </li>
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
</div>

  );
}

export default RootFolderComponent;
