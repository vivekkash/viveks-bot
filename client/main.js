import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import { Messages } from "../lib/services"; //import Messages Collection from services lib

import './main.html';


if (Meteor.isClient) {


    /* register users */

    Template.register.events({
        'submit form': function(event) {
            event.preventDefault();

            var registerData = {
                email: event.target.registerEmail.value,
                password: event.target.registerPassword.value
            }

            Accounts.createUser(registerData, function(error) {

                if (Meteor.user()) {
                    console.log(Meteor.userId());
                } else {
                    alert(error.reason);
                    console.log("ERROR: " + error.reason);
                }
            });
        }
    });

    /* login users, credentials checks */

    Template.login.events({

        'submit form': function(event,instance) {

            event.preventDefault();

            var myEmail = event.target.loginEmail.value;
            var myPassword = event.target.loginPassword.value;

            Meteor.loginWithPassword(myEmail, myPassword, function(error) {

                //check for user session
                if (Meteor.user()) {

                    console.log('Login Success');

                } else {

                    alert(error.reason);
                    console.log("error: " + error.reason);
                }
            });
        }
    });

    /* logouts user */

    Template.body.events({

        'click .logout': function(event) {
            event.preventDefault();

            Meteor.logout(function(error) {

                if(error) {

                    alert(error.reason);
                    console.log("ERROR: " + error.reason);
                }
            });
        }
    });

    /* Post user query to postUserMessage of services to get agents reply and persist message into mongo */

    Template.postMessage.events({

        'click .send': function(event,instance){

           event.preventDefault();

            var mesg = instance.find('#message').value;

            if(mesg=='' || mesg==null){

                alert('Message cannot be empty');
                console.log('Message cannot be empty');
                return false;
            }

            Meteor.call('postUserMessage', mesg, function (error, result) {

                if(error){
                 console.log(error);
                }

                var objDiv = document.getElementById("chatbox");
                objDiv.scrollTop = objDiv.scrollHeight + 10;


            });

            instance.find('#message').value ='';
            instance.find('#message').focus();

           


        },

        /* Post user query to postUserMessage of services to get agents reply by press of enter and persist message into mongo*/

        'keypress input#message': function(event,instance){

            if(event.which==13) {
                event.preventDefault();

                var mesg = instance.find('#message').value;

                if(mesg=='' || mesg==null){

                    alert('Message cannot be empty');
                    console.log('Message cannot be empty');
                    return false;
                }


                Meteor.call('postUserMessage', mesg, function (error, result) {

                    if (error) {
                        console.log(error);
                    }

                    var objDiv = document.getElementById("chatbox");
                    objDiv.scrollTop = objDiv.scrollHeight + 10;


                });

                instance.find('#message').value = '';
                instance.find('#message').focus();

            }

        }

    });

    /* Populate the chat box with the user messages from mongo */

    Template.chatbox.helpers({

        messages : function(){

            if (Meteor.user()) {

                var userMesssages = Messages.find({user_id: Meteor.userId()}).fetch();

                /* mapping the data to change the date format*/
                var data = userMesssages.map((x)=>{
                    return {
                        'message': x.message,
                        'createdAt': moment(x.createdAt).fromNow(),
                        'botReply':x.botReply
                    }
                });

                Meteor.setTimeout(function(){

                    var objDiv = document.getElementById("chatbox");
                    objDiv.scrollTop = objDiv.scrollHeight + 10;
                     document.getElementById("message").focus();

                },500);


                return data;

            }else{

                console.log("ERROR: " + error.reason);

            }

        }
    });

}


