import {useState} from 'react';
export const useEditHttp = () =>{


    const [fetchData,setFetchedData] = useState(null);
    const [message, setMessage] = useState('');

    async function fetchCall(url,body){
        console.log('edit http request');
        const res=await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: body
      })
      const data = await res.json();
      if(res){
        setMessage(data.success_message);
      if(res.status === 200){
        alert("Attendance Edited");
        }
      }
    }
    return [message,fetchCall];    
} 