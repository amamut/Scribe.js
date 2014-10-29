/*jshint -W020 */

(function () {

    'use strict';

    var Console2  = require('./lib/console2.js'),
        LogWriter = require('./lib/logWriter.js');

    /**
     * scribe
     *
     * Scribe.js module
     *
     * @param {Object}       scribeOpt                        Optional options
     * @param {String}       scribe.rootPath                  Logs folder. Default 'logs'
     * @param {Boolean}      scribeOpt.createDefaultConsole   Should scribe attach a fresh Console2 
     *                                                        to process.console ? Default true.
     *
     * @return {Object}
     * @return {Function}    console                Get a console
     * @return {Constructor} Console2               Console2 constructor
     */
    var scribe = function (scribeOpt) {

        //Scribe options
        
        if (!scribeOpt) {
            scribeOpt = {};
        }

        scribeOpt.rootPath             = scribeOpt.rootPath || 'logs';
        scribeOpt.createDefaultConsole = scribeOpt.createDefaultConsole !== false;


        /**
         * listenOnConsole
         *
         * Listen on console2 events 'new' and 'newLogger'
         * Save logs and options.
         *
         * @param {Console2}    console2    A Console2 instance
         * @param {Object}      opt         LogWriter options
         * @param {LogWriter}   logWriter   A LogWriter instance
         */
        var listenOnConsole = function (console2, opt, logWriter) {

            //On new log, save it
            console2.on('new', function (log) {
                
                logWriter.save(log, {
                    rootPath : opt.rootPath || scribeOpt.rootPath,
                    logger   : log.opt
                });

            });

            //On new logger, save its options
            console2.on('newLogger', function (logger, loggerOpt) { 

                logWriter.saveOpt(loggerOpt, {
                    rootPath : opt.rootPath || scribeOpt.rootPath   
                });

            });
        };


        if (scribeOpt.createDefaultConsole) {

            //Create a default console2 and attach it to process
            process.console = new Console2();

            listenOnConsole(
                process.console,
                {
                    rootPath : scribeOpt.rootPath
                },
                new LogWriter()
            );
        }


        return  {

            /**
             * console
             *
             * Create a new console
             *
             * @param {Object}       config            Config options
             * @param {?Object}      config.console    Console2 options
             * @param {?Object}      config.logWriter  LogWriter options.
             *                                         If false, Scribe won't save logs on disk.
             *
             * @param {LogWriter}    logWriter         Optional. A custom logWriter instance
             *
             * @return {Console2}                      A new Console2 instance
             */
            console : function (config, logWriter) {

                var console = new Console2(config.console || {});

                if (config.logWriter !== false) { //if config.logWriter is false, don't save logs
                    listenOnConsole(
                        console,
                        config.logWriter,
                        logWriter || new LogWriter()
                    );
                }

                return console;
            },
    
            /**
             * Console2
             *
             * @constructor
             */
            Console2 : Console2,

            /**
             * LogWriter
             *
             * @constructor
             */
            LogWriter : LogWriter
        };
    };  

    module.exports = scribe;

}());
