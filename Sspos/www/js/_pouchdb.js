/***
*Pouchdb basic method package
*xfang
*/
_pouchdb = (function () {
	'use strict';
	var ret = {};
	/***
	*create database
	*@param {options:'adapter',dbname:'dbname',adapter:'websql'} eg
	*@param {options:'ajax',username:'username',password:'password'} eg
	*@return db
	*/
	ret.createDB = function (_param) {
		var db = {};
		switch(_param.options){
			case 'adapter' :
				db = new PouchDB(_param.dbname, {adapter : _param.adapter});
				return db;
			case 'ajax' :
				db = new PouchDB(_param.url, {
					  ajax: {
					    cache: false,
					    timeout: 10000,
					    headers: {
					      'X-Some-Special-Header': 'foo'
					    },
					  },
					  auth: {
					    username: _param.username,
					    password: _param.password
					  }
					});
				return db;
			default : return db;
		}
	}
	/***
	*deltet database
	*@param {db:db}
	*@return result
	*/
	ret.destroydb = function (_param) {
		var db = _param;
		db.destroy(function (err,response) {
			if(err) {return err;}
			return response;
		});
	}
	/***
	*close db
	*/
	ret.close = function (_param) {
		var db = _param.db;
		db.close(function () {
			console.log("db close");
		})
	}
	/***
	*Create a new doc
	*@param {db:db,doc:{_id:'123',test1:'fx'....}}
	*@return result
	*/
	ret.put = function (_param, fun) {
		var db = _param.db;
		db.put(_param.doc, function(err, response) {
			if(err) {return fun(err);}
			return fun(response);
		})
	}
	/***
	*auto-generate an _id
	*@param {db:db,doc:{test1:'fx'....}}
	*@return result
	*/
	ret.post = function (_param, fun) {
		var db = _param.db;
		db.post(_param.doc, function(err, response) {
			if(err) {return fun(err);}
			return fun(response);
		})
	}
	/***
	*Fetch a document
	*@param {db:db,_id:'123'}
	*/
	ret.get = function (_param, fun) {
		var db = _param.db;
		db.get(_param.doc._id, function(err, doc) {
			if(err) {return fun(err);}
			return fun(doc);
		})
	}
	/***
	*Create/update a batch of documents
	*@param {db:db,doc:[{title : 'Lisa Says', _id: 'doc1'},{title : 'Space Oddity', _id: 'doc2'}]}
	*@param {db:db,doc:[{title : 'Lisa Says',artist : 'Velvet Underground',_id    : "doc1",_rev   : "1-84abc2a942007bee7cf55007cba56198"}]}
	*@param {db:db,doc:[{title : 'Lisa Says',_deleted : true,_id : "doc1",_rev : "1-84abc2a942007bee7cf55007cba56198"}]}
	*/
	ret.bulkDocs = function (_param, fun) {
		var db = _param.db;
		db.bulkDocs(_param.doc, function(err, response) {
		  	if(err) {return fun(err);}
			return fun(response);
		});
	}
	/***
	*Document bulk get
	*@param [{id : '1478749838953',rev : '1-12933a4fdbe850156d01dfeda7a08004'}]
	*/
	ret.bulkGet = function (_param, fun) {
		var db = _param.db;
		db.bulkGet({docs : _param.docs}, function (err, result) {
			if(err) {return fun(err);}
			return fun(result);
		})
	}
	/****
	*Fetch a batch of documents
	*options.include_docs: Include the document itself in each row in the doc field. Otherwise by default you only get the _id and _rev properties.
    *options.conflicts: Include conflict information in the _conflicts field of a doc.
    *options.attachments: Include attachment data as base64-encoded string.
    *options.binary: Return attachment data as Blobs/Buffers, instead of as base64-encoded strings.
    *options.startkey & options.endkey: Get documents with IDs in a certain range (inclusive/inclusive).
	*@param {db:db,doc:{include_docs: true,attachments: true,startkey: 'bar',endkey: 'quux'}}
	*/
	ret.allDocs = function (_param, fun) {
		var db = _param.db;
		db.allDocs(_param.doc, function(err, response) {
		    if(err) {return fun(err);}
		    return fun(response);
		});
	}
	/****
	*Delete a document
	*@param {db:db,doc:{_id:_id}}
	*/
	ret.remove = function (_param, fun) {
		var db = _param.db;
		db.get(_param.doc._id, function(err, doc) {
		  if(err) {return fun(err);}else {
		    db.remove(doc, function(err, response) {
		   		if(err) {return fun(err);}
				return fun(response);
		  	});
		  }
		});
	}
	/***
	*update an existing doc by _id _rev
	*@param {db:db,doc:{_id:'mydoc',_rev:'',test1:'1234'}}
	*@return result
	*/
	ret.updateByIdAndRev = function (_param, fun) {
		var db = _param.db;
		var param = _param.doc;
		db.get(param._id, function(err, doc) {
			if(err) {fun(err);}else {
				for(var va in doc) {
					if(param[va]=='' || param[va] == undefined)
						param[va] = doc[va];
				}
				db.put(param, function(err, response) {
					if(err) {return fun(err);}
					return fun(response);
				});
			}
		})
	}
	/****
	*Listen to database changes
	*portion options.live: Will emit change events for all future changes until cancelled.
	*options.since: Start the results from the change immediately after the given sequence number. You can also pass 'now' if you want only new changes (when live is true).
	*
	*options.include_docs: Include the associated document with each change.
	*/
	ret.changes = function (_param, fun1, fun2, fun3) {
		var db = _param.db;
		_param.changes = db.changes(_param.doc).on('change', function(change) {
			fun1(change);
		}).on('complete', function(info) {
			fun2(info);
		}).on('error', function(err) {
			fun3(err);
		})
	}
	/*****
	*cancel changes
	*/
	ret.changesCancel = function (_param) {
		_param.changes.cancel();
	}
	/*****
	*Replicate a database
	*/
	ret.replicate = function (_param, fun1, fun2, fun3, fun4, fun5, fun6) {
		_param.rep = PouchDB.replicate(_param.source, _param.target,_param.doc)
				  .on('change', function (info) {
					fun1(info);
				  }).on('paused', function (err) {
				  	fun2(err);
				  }).on('active', function () {
				  	fun3();	
				  }).on('denied', function (err) {
				  	fun4(err);
				  }).on('complete', function (info) {
				  	fun5(info);
				  }).on('error', function (err) {
				  	fun6(err);
				  });
	}
	/***
	*cancel replicate
	*/
	ret.replicateCancel =  function (_param) {
		_param.rep.cancel();
	}
	/***
	*Sync a database
	*/
	ret.sync = function (_param, fun1, fun2, fun3, fun4, fun5, fun6) {
		_param.sync = PouchDB.sync(_param.source, _param.target,_param.doc)
				  .on('change', function (info) {
					fun1(info);
				  }).on('paused', function (err) {
				  	fun2(err);
				  }).on('active', function () {
				  	fun3();	
				  }).on('denied', function (err) {
				  	fun4(err);
				  }).on('complete', function (info) {
				  	fun5(info);
				  }).on('error', function (err) {
				  	fun6(err);
				  });
	}
	/***
	*cancel Sync
	*/
	ret.syncCancel = function(_param) {
		_param.sync.cancel();
	}
	return ret;
})();