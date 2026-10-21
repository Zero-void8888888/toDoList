/*
Author: Jose Mondragon
Date:10/19/26
Description: Todo List
*/
import sqlite3 from 'sqlite3'
import promptSync from 'prompt-sync'

let Prompt = promptSync();

let db = new sqlite3.Database("./database/todolist.sqlite", (err) =>{
    if(err){
        console.log(err.message)
    }
})

async function main(){
    // return the rows from user
    try{
        let rowsUsers =  await queryAllPromise("SELECT * FROM users")
        //return the rows from tasks
        let rowsTasks = await queryAllPromise(" SELECT  * FROM tasks ")
        //console.log(rows)
    }
    catch(err) {
        console.error(err)
    }



    //insert tasks and users
    let insertUsers = "INSERT INTO users(username) values (?)"
    let insertTasks = "INSERT INTO tasks(user_id, task_desc,is_complete) values (?,?,?)"

    //let values = ['john','doe', (new Date()).getTime()];

    let getUsers = "SELECT * FROM users WHERE username = ?"

   // await addQueryPromise(insertUsers,values);
   //await addQueryPromise(insertTasks,values)
   let isNotNumber = true;
   let input;
   do{
   console.log("Welcome to CPI310 Simple ToDO List\n")
   console.log(" 1) Log In")
   console.log(" 2} Create Account")
   console.log(" 3) Exit.")
   console.log("(please enter a number)")
   input = Prompt('    ');
   if(!Number.isNaN(Number(input))){
      input = Number(input);
      isNotNumber = false
   }

   }while(isNotNumber)

// after the loop. we create an if else if else block to choose a path
   if(input == 1 ){
        let userNotExits = true;
        do{
            let enterUserName = Prompt("Enter UserName: ")
            let values  = [enterUserName];
            let user_id;
            try{
                let userRow =  await queryGetPromise(getUsers , values)
                if (userRow){
                    user_id = userRow.user_id
                    userNotExits = false
                    toDoMenu(user_id, insertTasks)
                }
                else{
                    console.log("user does not exist")

                }

            }
            catch(err){
                console.error(err)
            }
    }while(userNotExits)




}



    else if( input == 2){
        let doesNotExist = true
        let user_id;
        //loop until it creates a user that doesn't exist
        do{
            console.log("\nCreating a new account:")
            let userNameInput = Prompt("Enter UserName: ")
            let rowsUsers;
            try{
                rowsUsers =  await queryAllPromise("SELECT * FROM users")

            }
            catch(err) {
                console.error(err)
            }

            // Call the run all query to get the rows in users
            // check if the username exist, if it does, repromt them else add it to the user date base
            doesNotExist = true;
        for ( const user of rowsUsers){
            if(user.username == userNameInput){
                console.log("The userName already exist, try a different one");
                doesNotExist = false;
                break
            }
        }
        if(doesNotExist == true){
            let values =[userNameInput]
            user_id =  await addQueryPromise(insertUsers, values)
            console.log("creating account...");
        }

        }while(!doesNotExist)
        //proceding to the to do menu
        toDoMenu(user_id,insertTasks)
    }
// this is option 3
    else{

    }





}

function queryAllPromise(query,values){
    return new Promise((resolve,reject)=>{
        db.all(query,values,(err,rows)=>{
            if(err){
               return reject(err.message)
            }
            resolve(rows)
        })
    }

    )
}

function queryGetPromise(query, values){
    return new Promise((resolve,reject)=>{
        db.get(query,values,(err,row)=>{
            if(err){
               return reject(err.message)
            }
            resolve(row)
        })
    }

    )
}

async function toDoMenu( user_id , insertTasks){
    let logoutIsFalse = true;
    do{
        //loop until a valid number is entered
        let isNotNumber2 = true;
        let response;
        do{
            console.log("**********************\n");
            console.log("ToDo Menu")
            console.log("1. See ALL Tasks")
            console.log("2. See Incomplete Tasks")
            console.log("3. See Complete Tasks")
            console.log("4. Add a Task")
            console.log("5. Set a Task as complete")
            console.log("0. Logout and Exist")
            response = Prompt("   ");
            if(!Number.isNaN(Number(response))){
                response = Number(response);
                isNotNumber2  = false
            }
    }while(isNotNumber2);
    if(response  == 1){
        //see all task
        let tasks;
        try{
            tasks = await queryAllPromise("SELECT * FROM tasks where user_id = ?  ", [user_id])
            if(tasks.length > 0){
                console.log("");
                console.log(tasks)
            }
            else{
                console.log("");
                console.log("There are no task");
            }
        }
        catch(err){
            console.log("");
            console.error(err);
        }

    }
    else if(response == 2){
        //see all incomplete task
        let tasks;
        try{
            tasks = await queryAllPromise("SELECT * FROM tasks where user_id = ? and is_complete = ? ", [user_id,false])
            if(tasks.length > 0){
                console.log("");
                console.log(tasks)
            }
            else{
                console.log("");
                console.log("There are no incomplete task");
            }
        }
        catch(err){
            console.log("");
            console.error(err);
        }

    }
    else if (response == 3){
        let tasks;
        try{
            tasks = await queryAllPromise("SELECT * FROM tasks where user_id = ? and is_complete = ? ", [user_id,true])
            if(tasks.length > 0){
                console.log("");
                console.log(tasks)
            }
            else{
                console.log("");
                console.log("There are no complete task");
            }
        }
        catch(err){
            console.log("");
            console.error(err);
        }

    }
    else if (response == 4){
        try{
            let taskDescription = Prompt("Please, enter a description for the task Item: ")
            await addQueryPromise(insertTasks,[user_id,taskDescription,false])
            console.log("task added....")
        }
        catch(err){
            console.log("");
            console.error(err)
        }

    }
    else if (response == 5){
        //see all task
        let tasks;
        try{
            tasks = await queryAllPromise("SELECT * FROM tasks WHERE user_id = ? AND is_complete = ? ", [user_id,false])
            if(tasks.length > 0){
                console.log("");
                console.log(tasks)
                let task = Number(Prompt("Enter the task id that you want to mark complete: "))
                await updateQueryPromise("UPDATE tasks SET is_complete = ? WHERE task_id = ? AND user_id = ?" , [true,task,user_id])

            }
            else{
                console.log("");
                console.log("There are no task");
            }

        }
        catch(err){
            console.log("");
            console.error(err);
        }
    }
    else if (response == 0){
        logoutIsFalse = false;
    }
   }while(logoutIsFalse);
}

function addQueryPromise(query,values){
    return new Promise((resolve, reject) =>{
        db.run(query,values,function (err){
            if(err){
                return reject(err.message);
            }
            resolve(this.lastID);
        })
    })
}
function updateQueryPromise(query,values){
    return new Promise((resolve,reject) =>{
        db.run(query,values, function(err){
            if(err){
                return reject(err.message)
            }
            resolve()
        })
    })
}

main()


