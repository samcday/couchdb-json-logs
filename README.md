# couchdb-json-logs

Raw CouchDB log lines go in. JSON log records go out.

```bash
npm -g install couchdb-json-logs

cat /var/log/couchdb/couch.log | couchdb-json-logs
```

Uses [bunyan](https://github.com/trentm/node-bunyan) and [isaacs/couchdb-log-parse](https://github.com/isaacs/couchdb-log-parse) to do the magic.

## License 

[MIT License](LICENSE).
