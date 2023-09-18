import { useEffect, useState } from 'react';
import axios from 'axios';
import "./rootfolder.css";
import WordIcon from "./assets/icon-word.svg"
import FolderIcon from "./assets/icon-folder.svg"
import PdfIcon from "./assets/icon-pdf.svg"



function RootFolderComponent() {
  const [rootFolderData , setRootFolderData] = useState({childs:[]});
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

  const renderTree = (data) => {
    return (
      <ul className="tree">
        {data.childs.map((item) => (
          <li key={item.id}>
            <details>
              <summary>
                {/* Dosya türüne göre uygun SVG simgesini kullanmı */}
                {item.isFolder ? (
                  <img src={FolderIcon} alt="Folder Icon" />
                ) : item.extension === 'pdf' ? (
                  <img src={PdfIcon} alt="PDF Icon" />
                ) : item.extension === 'docx' ? (
                  <img src={WordIcon} alt="Word Icon" />
                ) :  item.extension === 'docx' (
                 
                )}
                {item.name}
                </summary>
              {item.isFolder && item.portfolios && item.portfolios.length > 0 && (
                <ul>
                  {item.portfolios.map((portfolio) => (
                    <li key={portfolio.id}>{portfolio.name}</li>
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
  </div>

  );
}

export default RootFolderComponent;
