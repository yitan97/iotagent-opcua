'use strict';
var config = require('./../../../conf/config.json');
var mongoose = require('mongoose');
var commands = require('../../../node_modules/iotagent-node-lib/lib/services/commands/commandService');
var async = require("async");
var result={};
// Get list of Commands
exports.status = function(req, res) {
    var commandListAllDevices=[];
    var count=0;
    // each of the following steps is executed in due order
    // each step MUST call callback() when done in order for the step sequence to proceed further
    async.series([
    //------------------------------------------
    function (callback) {
        for (var i = 0, len = config.contexts.length; i < len; i++) {
            var context=config.contexts[i];
            commands.list(config.service, config.subservice, context.id ,function(error, commandList) {
                count+=commandList.count;
                commandListAllDevices.push.apply(commandListAllDevices, commandList.commands);
                if (i==len)
                    callback();
            });
        }
    },

    function (callback) {
        result.count=count;
        result.commands=commandListAllDevices;
        return res.status(200).json(result);
    }]);
};