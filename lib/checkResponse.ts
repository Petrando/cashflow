export default function checkResponse(res){
    if(!res.ok) {
        throw Error(res.statusText);
    }
}