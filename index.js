#!/usr/bin/env node

"use strict";

var bunyan = require("bunyan");

var logName = process.argv[2] || "couchdb";
var log = bunyan.createLogger({name: logName});
var parser = new (require("couchdb-log-parse"));

process.stdin.pipe(parser);

var currentRecord;

parser.on("message", function(record) {
  if (record.raw) {
    if (currentRecord) {
      if (!currentRecord.supplemented) {
        currentRecord.msg += "\n";
        currentRecord.supplemented = true;
      }
      currentRecord.msg += record.raw;
    } else {
      log.info(record.raw.trim());
    }
    return;
  }

  if (currentRecord) {
    log[currentRecord.level](currentRecord.record, currentRecord.msg.trim());
    clearTimeout(currentRecord.timeout);
    currentRecord = null;
  }

  var msg = record.message;
  var level = record.level;

  record.time = record.date;
  delete record.date;
  delete record.message;
  delete record.level;
  delete record.pid;

  // If dump doesn't look like an erlang object then push it into msg.
  if (record.dump && record.dump[0] !== "{") {
    msg = msg + record.dump;
    delete record.dump;
  }

  if ("http" === record.type) {
    msg = record.method + " " + record.url;
  }

  currentRecord = {record: record, msg: msg, level: level};
  currentRecord.timeout = setTimeout(function() {
    log[currentRecord.level](currentRecord.record, currentRecord.msg.trim());
    currentRecord = null;
  }, 100);
});
