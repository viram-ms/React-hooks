import {useState, useEffect} from 'react';

export const useHttp = (url, dependencies) =>{
    const [fetchData,setFetchedData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            console.log('sending http request');
            try {
                const res=await fetch(url, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Requested-With': 'XMLHttpRequest',
                      'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                  })
                  const data = await res.json();
                  if(res.status === 200){
                    setFetchedData(data);  
                }
            } catch(e){
                console.log(e);
            }
        }
        fetchData();
       
    },dependencies)

  
    return [fetchData];
};