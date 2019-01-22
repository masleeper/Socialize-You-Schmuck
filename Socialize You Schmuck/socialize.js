var mod=angular.module('Socialize',['ngRoute', 'ngCookies']);
    
//provides routing based on the url of the site using ngRoute which is passed in above
mod.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'login/login.html',
        controller:'LoginCtrl',
        controllerAs:'login'
    })
    .when('/login',{
        templateUrl:'login/login.html',
        controller:'LoginCtrl',
        controllerAs:'login'
    })
    .when('/create',{
        templateUrl:'create/create.html',
        controller:'CreateCtrl',
        controllerAs:'create'
    })
    .when('/chat',{
        templateUrl:'chat/chat.html',
        controller:'ChatCtrl',
        controllerAs:'chat'
    })
    .when('/request',{
        templateUrl:'request/request.html',
        controller:'RequestCtrl',
        controllerAs:'request'
    })
    .otherwise({redirecTo:'/'});
});

mod.controller('MainCtrl',function(retainService, $location, $interval){
    var main=this;
    
    main.log=""; 
    
    //is used to determin whether user is logged in or not
    $interval(function(){
        if(retainService.getUser().id===undefined){
            main.log="";
        }else{
            main.log="logout";
        }
    },100);
    
    //logs the user out by using retainService
    main.logout=function(){
        retainService.deleteUser();
        $location.path("/login");
    };
});


//controller for the login section
mod.controller('LoginCtrl',function($location, $http, retainService){
    var login=this;
    
    login.username="";
    login.password="";
    login.valid="";//validity of login info
    
    login.login=function(){
        if(login.username==="" && login.password===""){
            alert("Enter a username and password");
        }else if(login.username===""){
            alert("Enter a username");
        }else if(login.password===""){
            alert("Enter a password");
        }else{
            //login creds to be sent
            var info={
                un:login.username,
                pw:login.password
            };
            
            //sends info object to php script for sending
            $http.post('login/send.php',info).then(
                function(result){
                    if(result.data=="true"){
                        //for obtaining the user id if login is valid
                        $http.post('login/userid.php',info.un).then(
                            function(result){
                                retainService.setUser(result.data, info.un);
                            },
                            function(reason){
                                console.log(reason);
                            }   
                        );
                        //reroutes to the chat page after verfying info and getting username and id
                        $location.path('/chat');   
                    }else{
                        login.valid="Invalid Login";
                    }
                 
                },
                function(reason){
                    return reason;
                }
            );
        }
        login.username="";
        login.password="";
    };
});


//controller for user creation page
mod.controller('CreateCtrl',function($http, $location){
    var create=this;
    
    create.un="";
    create.pw="";
    create.validUn="";
    
    //sends info needed to create an account
    create.send=function(){
        var info={un:create.un, pw:create.pw};
        $http.post('create/send.php',info).then(
            function(result){
                // console.log(result);
                create.un="";
                create.pw="";
                $location.path('/login');
                alert("You can now login to your account.");
            },
            function(reason){
                console.log(reason);
            }
        );
    };
});

//controller for chat section
mod.controller('ChatCtrl',function($http, $location, $interval, retainService){
    var chat=this;
    
    chat.message="";//message to be sent
    chat.partner=0;//user id of chat partner
    chat.messages=[];//array of messages sent to current partner
    chat.user=retainService.getUser().user;//user id
    chat.friends=[];//array of friends user can chat with
    
    //sends the message in chat.message
    chat.send=function(){
        if(chat.partner===0){//if user hasn't selected a chat partner
            alert("Choose a friend to chat with");
        }else{
            //message info needed to be sent
            var messageinfo={
                text:chat.message,
                fromuser:retainService.getUser().id,
                touser:chat.partner
            };
            
            //sends the message to script for sending
            $http.post('chat/send.php', messageinfo).then(
                function(result){
                    //updates chat.messages with messages sent by user
                    chat.getMessages();
                },
                function(reason){
                    console.log(reason);
                }
            );
            chat.message="";//resets sent message back to null
        }
    };
    
    //updates the chat.messages array with messages from user and partner
    chat.getMessages=function(){
        $http.get('chat/getMessages.php').then(
            function(result){
                var arr=result.data;//all messages on server
                //sort done to keep chronological order of messages
                arr.sort(function(a,b){
                    var c=a.date_sent.split(/[- :]/);
                    var cDate=new Date(c[0], c[1]-1, c[2], c[3], c[4], c[5]);
                    var d=b.date_sent.split(/[- :]/);
                    var dDate=new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]);
                    if(c>d){
                        return 1;
                    }else if(c<d){
                        return -1;
                    }else{
                        return 0;
                    }
                });
                
                //to add new messages
                var chatLength=chat.messages.length;
                for(var i=0;i<arr.length;i++){
                    var message=arr[i];
                    if(message.from_user_id==retainService.getUser().id && message.to_user_id==chat.partner){//if message is from user and to partner
                        message.text="You: "+message.text;
                        var add=true;
                        for(var j=0;j<chatLength;j++){//for fixing issue of duplicate messages making it into chat.messages
                            if(chat.messages[j].date_sent==message.date_sent){
                                add=false;
                            }
                        }
                        if(add){
                            chat.messages.push(message);
                        }
                     }else if(message.from_user_id==chat.partner && message.to_user_id==retainService.getUser().id){//if message if from partner and to user
                        message.text="Them: "+message.text;
                        var add=true;
                        for(var j=0;j<chatLength;j++){//for fixing issue of duplicate messages making it into chat.messages
                            if(chat.messages[j].date_sent==message.date_sent){
                                add=false;
                            }
                        }
                        if(add){
                            chat.messages.push(message);
                        }
                    }
                }
            },
            function(reason){
                console.log(reason);
            }
        );
    };
    
    //gets friends list of user and fills chat.friends
    chat.getFriends=function(){
        $http.post('chat/getFriends.php', retainService.getUser().id).then(
            function(result){
                chat.friends=[];
                for(var i=0; i<result.data.length;i++){//puts friends in list received into chat.friends
                    chat.friends.push(result.data[i]);
                }
            },
            function(reason){
                console.log(reason);
            }
        );
    };
    
    //changes chat partner
    chat.setPartner=function(user){
        $http.post('chat/setPartner.php',user).then(
            function(result){
                chat.partner=result.data;
                chat.messages=[];
            },
            function(reason){
                console.log(reason);
            }
        );
    };
    
    $interval(chat.getMessages,100);//done to get messages from chat partner
    $interval(chat.getFriends,500);//done to update friends
});


//controller for request section 
mod.controller('RequestCtrl',function(retainService, $http, $interval){
   var request=this;
   
   request.user="";//username of potential friend
   
   request.pending=[];//list of pending requests for the user
   
   request.send=function(){
       $http.post('request/checkUser.php', request.user).then(//checks if potential friend actually exists
           function(result){
               if(result.data!=0){//if the potential friend actually exists
                    var info={from:retainService.getUser().id, to:result.data};//info for request in server
                    $http.post('request/sendRequest.php',info).then(//sending of request
                        function(result){
                           
                        },function(reason){
                           console.log(reason);
                        }
                    );
               }else{
                   alert("User doesn't exist");
               }
           },
           function(reason){
               console.log(result);
           }
        );
        request.id="";
   };
   
   //update requests.pending with requests user needs to process still
   request.showRequests=function(){
       $http.post('request/showRequests.php', retainService.getUser().id).then(
           function(result){
               var arr=result.data;//array of friends' usernames
               request.pending=[];
               for(var i=0;i<arr.length;i++){
                   request.pending.push(arr[i]);
               }
           },
           function(reason){
               console.log(reason);
           }
        );
   };
   
   //to accept request
   request.accept=function(fromUser){
        var info={to:retainService.getUser().id, ack:'accept', from:fromUser};
       $http.post('request/response.php', info).then(
           function(result){
               console.log(result);
           },
           function(reason){
               console.log(reason);
           }
        );
        
   };
   
   //to decline request
   request.decline=function(fromUser){
       var info={to:retainService.getUser().id, ack:'decline', from:fromUser};
       $http.post('request/response.php', 'decline').then(
           function(result){
               console.log(result);
           },
           function(reason){
               console.log(reason);
           }
        );
   };
   
   $interval(request.showRequests,500);//to update requests sent to user
});

//service made to retain user info on refresh and give access to user info in all parts of the application with the use of cookies
mod.service('retainService',function($cookies){
    //sets the user id and username
    this.setUser=function(id, user){
        if($cookies.get('id')!==user && $cookies.get('user')!==id){
            $cookies.remove('id');
            $cookies.remove('user');
        }
        $cookies.put('id',id);
        $cookies.put('user',user);
    };
    
    //gets user id and username 
    this.getUser=function(){
        var userinfo={user:$cookies.get('user'), id:$cookies.get('id')};
        // console.log(userinfo);
        return userinfo;
    };
    
    //deletes user id and username. to only be used on logout
    this.deleteUser=function(){
      $cookies.remove('id');
      $cookies.remove('user');
    };
});

