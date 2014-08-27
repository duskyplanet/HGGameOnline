/**
 * Created by Administrator on 2014/5/7.
 */
var mysqlExc = require('./db_config/db_connector');
var user = require('./sqlMap/user').sql;

//exports.queryTeam = function(callback){
//    var sql = 'Select * from t_team where `spel`=?';
//    var queryType = 1;
//    mysqlExc.exec(sql,queryType,function(err,rows){
//        if(err){
//            res(500);
//            return;
//        }
//        callback(rows);
//    });
//};
//
//exports.login = function(params,callback){
//    var username = params[0];
//    var password = params[1];
//    var sqlUser = user.sql.query_user_by_name_pass;
//    mysqlExc.exec(sqlUser,[username,password],function(err,rows){
//        if(err){
//            return;
//        }
//        var userR = rows[0];
//        var sqlNick = user.sql.query_member_by_id;
//        mysqlExc.exec(sqlNick,userR.id,function(err,nick){
//            if(err){
//                return;
//            }
//            callback(err,nick[0].name);
//        });
//    });
//};
//
//exports.regUser = function(params,callback){
//    var username = params[0];
//    var nickname = params[1];
//    var desc = params[2];
//    var password = params[3];
//    var sqlUser = user.sql.query_user_by_name;
//    var sqlTeam = user.sql.query_team_by_name;
//    var sqlRegUser = user.sql.regUser;
//    var sqlRegTeam = user.sql.regTeam;
//    mysqlExc.exec(sqlUser,[username],function(err,rows) {
//        if(rows.length>0){
//            callback(err,rows,"name");
//            return;
//        }
//        mysqlExc.exec(sqlTeam,[nickname],function(err,rows){
//            if(rows.length>0){
//                callback(err,rows,"nick");
//                return;
//            }
//            mysqlExc.exec(sqlRegUser,[username,password],function(err,rows){
//                if(err){
//                    callback(err);
//                    return;
//                }
//                var id = rows.insertId;
//                mysqlExc.exec(sqlRegTeam,[id,nickname,desc],function(err,rows){
//                    if(err){
//                        callback(err);
//                        return;
//                    }
//                    callback(err,username);
//                });
//            });
//        });
//    });
//};
//
//exports.addscore = function(name,callback){
//    var sql = user.sql.add_score_by_name;
//    mysqlExc.exec(sql,name,function(err,rows){
//        if(err){
//            return;
//        }
//        callback(rows);
//    });
//};
//
//exports.resetVote = function(){
//    var sql = user.sql.reset_vote;
//    mysqlExc.exec(sql,null,function(err,rows){
//        return;
//    });
//};
//
//var queryInfo =  function(name,callback){
//    var queryInfo = user.sql.query_team_all_by_name;
//    var queryComment = user.sql.query_comment_by_name;
//    mysqlExc.exec(queryInfo,name,function(err,member){
//        if(err){
//            return;
//        }
//        var member = member[0];
//        mysqlExc.exec(queryComment,name,function(err,comments){
//            if(err){
//                return;
//            }
//            for(var i=0; i<comments.length;i++){
//                comment = comments[i];
//                comment.crt_time = comment.crt_time.toDateString();
//            }
//            callback(err,member,comments);
//        });
//    });
//}
//exports.queryInfo = queryInfo;
//
//exports.addcomment = function(to,nick,comment,callback){
//    var sql = user.sql.add_comment;
//    mysqlExc.exec(sql,[to,nick,comment],function(err,rows){
//        if(err){
//            return;
//        }
//        queryInfo(to,callback);
//    });
//};

exports.queryUserByName = function(name,callback){
    var sql = user.query_user_by_name;
    mysqlExc.exec(sql,name,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        callback(null,rows);
    });
};

exports.queryUserByNick = function(nick,callback){
    var sql = user.query_user_by_nick;
    mysqlExc.exec(sql,nick,function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        callback(null,rows);
    });
};

exports.login =login;
function login(name,pswd,callback){
    var sql = user.login;
    mysqlExc.exec(sql,[name,pswd],function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        callback(null,rows);
    });
};

exports.reg =reg;
function reg(params,callback){
    var sqlRegUser = user.regUser;
    var sqlRegUserInfo = user.regUserInfo;
    var sqlLastId = user.getLastUserIndex;
    var lastId = 1;
    mysqlExc.exec(sqlRegUser,params.slice(0,3),function(err,rows){
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            mysqlExc.exec(sqlLastId,null,function(err,rows){
                if(err){
                    console.log(err);
                    callback(err,null);
                }else{
                    if(rows.length!=0) lastId = rows[0].id;
                    var newParams = params.slice(3,13);
                    newParams.unshift(lastId);
                    mysqlExc.exec(sqlRegUserInfo,newParams,function(err,suc){
                        if(err){
                            console.log(err);
                            callback(err,null);
                        }
                        callback(null,suc);
                    });
                }
            });
        }
    });
};

exports.sqlUserShowInfo =sqlUserShowInfo;
function sqlUserShowInfo(_nick,callback){
    var nick = _nick;
    var sqlUserInfo = user.getUserShowInfoByNick;
    mysqlExc.exec(sqlUserInfo,nick ,function(err,rows){
        if(err){
            callback(err,null);
        }else{
            callback(null,rows[0]);
        }
    });
}

exports.sqlGetMyInfo = sqlGetMyInfo;
function sqlGetMyInfo(_nick,callback){
    var nick = _nick;
    var sqlMyInfo = user.getMyInfo;
    mysqlExc.exec(sqlMyInfo,nick,function(err,rows){
        if(err){
            callback(err,null);
        }else{
            callback(null,rows[0]);
        }
    });
}
//
//
//function test(){
//    reg(["hjc",123,"阿黄","duskyhuang@163.com","","13899999999","",0,1,1,"新兵"],function(err,rows){
//        console.log(rows);
//    });
//}
//test();