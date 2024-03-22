const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage;

const client = new  todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())
const todoThing = process.argv[2]

client.createTodo({
    "id" :  -1,
    "text": todoThing
}, (err, response) => {
    console.log("Recieved from server " + JSON.stringify(response))
})

client.readTodos({}, (err, response) => {
    console.log("Recieved from server " + JSON.stringify(response))
    if(!response.items){
        response.items.forEach(item => console.log(item.text))
    }
  
})

const call = client.readTodosStream()

call.on("data", item => console.log("recieved item"+ item + "from server"))

call.on("end", e=> console.log("server closed"))