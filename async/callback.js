console.log("before")
getUser(1,function(user){
    console.log('User:', user);
})
console.log("after")

//callback function is called after getting the object
function getUser(id, callback){
    setTimeout(() => {
        console.log("Reading db...")
        callback({id:id, gitHubUsername:'bokai247'})
    }, 2000);
}