import {Mongo} from 'meteor/mongo';

import {check} from 'meteor/check';

import {HTTP} from 'meteor/http';


export const API_AI_KEY = '57f4871065284d5d8925813f6606cb3a';

export const API_AI_ENDPOINT = 'https://api.api.ai/v1/query?v=2050910';

//exporting the messages collection

export const Messages = new Mongo.Collection('messages');


// creating post method for client to post user query and get reply from the AI AGENT
Meteor.methods({

    postUserMessage(mesg) {


        check(mesg, String);

        if (Meteor.user()) {


            var messageData = {

                message: mesg,
                createdAt: new Date(),
                user_id: Meteor.userId(),
                botReply: ''

            };

            var id = Messages.insert(messageData);


            HTTP.call('GET', API_AI_ENDPOINT + '&query=' + mesg + '&lang=en&sessionId=' + Meteor.userId() + '&timezone=Asia/Calcutta', {headers: {'Authorization': 'Bearer ' + API_AI_KEY}},

                function (error, response) {

                    if (error) {

                        console.log(error);

                    } else {

                        Meteor.setTimeout(function(){


                            //Meteor.defer(function () {

                            var reply = response.data.result.fulfillment.speech;


                                var botReplyIsPresent = Messages.findOne({_id:id});

                                if(!botReplyIsPresent.botReply) {
                                    Messages.update({_id: id}, {$set: {botReply: reply}});
                                }

                           // });


                        },2000);


                    }

                });

        }
    }
})