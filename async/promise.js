console.log("before")
const p = getUser(1)
p.then(user=>console.log(user))
console.log("after")

//callback function is called after getting the object
function getUser(id){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log("Reading db...")
            resolve({id:id, gitHubUsername:'bokai247'})
        }, 2000);
    })
}