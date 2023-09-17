import { useEffect, useState } from 'react';
import axios from 'axios';
// import TreeComponent from './TreeComponent';

function RootFolderComponent() {
  const [rootFolderData , setRootFolderData] = useState(null);


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

  return (
    <div>
      {/* <h1>TreeView</h1> */}
      {rootFolderData && (
        <ul>
          {rootFolderData.childs.map((child) => (
            <li key={child.id}>{child.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RootFolderComponent;
