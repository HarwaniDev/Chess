async function fetchUserId( email:string ){
    try {
        const response = await fetch("http://localhost:3000/api/getUserId", {
            method: "POST",
                    body: JSON.stringify({
                        email: email,
                    }),
                    headers: {
                        "Content-type": "application/json",
                    },
        });
        const result = await response.json();
        return result.response;       
    } catch(e) {

    }
}