var mysql        = require("mysql");
var mysqlPool   = null;
var config = require("./mysql_config");

/**
 * 初始化数据库连接池
 */
function initMysqlPool () {
    mysqlPool = mysql.createPool(config);
    //console.log(mysqlPool);
}
/**
 * 执行SQL
 * @param sql
 * @param values
 * @param callback
 */
exports.exec = function(sql , values , callback){
    if (!mysqlPool) {
        initMysqlPool();
    }

    mysqlPool.getConnection(function(err,connection){
        connection.query(sql,values,function(err, rows){
            if(err){
                connection.release();
                callback(err,null);
            }
            connection.release();
            callback(null,rows);
        });
    });
}

/**
 * 关闭数据库连接池
 * @param callback
 */
exports.end = function(callback){
    if(mysqlPool){
        mysqlPool.end();
    }

    callback();
}
/**
 * 执行SQL 以事物形式
 * @param callback
 */
exports.execWithTranscation =function(callback){
    if (!mysqlPool) {
        initMysqlPool();
    }

    mysqlPool.getConnection(function(err,connection){
        callback(err,connection);
    });
}