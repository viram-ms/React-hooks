import {useState, useEffect} from 'react';


export const usePostHttp = () =>{
    const [fetchData,setFetchedData] = useState(null);
    const [open,setOpen] = useState(false);
    const [logged_in, setLoggin] = useState(false);

    // useEffect(() => {
        async function fetchCall(url,body) {
            console.log('sending http request');
            try {
                const res=await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: body
                  });
                  console.log(res);
                  if(res.status === 500){
                    setOpen(true);
                   }
                  const data = await res.json();
                 
                      console.log(open);
                      if(res.status === 200){
                        localStorage.setItem('token',data.token);
                        setLoggin(true);
                      }
            } catch(e){
                console.log(e);
            }
        }

        function closeBox(){
            setOpen(false);
        }

        function logout(){
            localStorage.removeItem('token');
            setLoggin(false);

        }
        
       
    // },dependencies)

  
    return {logged_in,open,fetchCall,closeBox,logout};
};