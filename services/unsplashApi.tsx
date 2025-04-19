const API_KEY = 'D8qrX4vsuHiUHQ7i5c4xDjeV8T4aFydc2ohb9uUTwBg'; 
const API_URL = 'https://api.unsplash.com/search/photos'
export const fetchUnsplashResponse = async(query:string, page:number)=>{
    const API_REQUEST=API_URL+`?query=${query}&per_page=5&client_id=${API_KEY}&page=${page}`;
    const response = await fetch(API_REQUEST);
    const data = await response.json();
    return data;
}