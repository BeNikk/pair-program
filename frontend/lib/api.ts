import { apiInterface } from "./type";

let api:apiInterface;
if(process.env.NEXT_PUBLIC_ENVIRONMENT == "DEVELOPMENT"){
    api = {
        http: new URL("http://localhost:8080"),
        ws:new URL("ws://localhost:8080")
    }
}
else{
    api = {
        http:new URL("https://pair-program-1.onrender.com"),
        ws:new URL("wss://pair-program-1.onrender.com")
    }
}
export default api;