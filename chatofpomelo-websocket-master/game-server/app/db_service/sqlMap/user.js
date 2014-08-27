/**
 * Created by Administrator on 2014/5/7.
 */

exports.sql = {
    query_user_by_name:"select * from t_users where name=?",
    query_user_by_nick:"select * from t_users where nick=?",
    login:"select * from t_users where name=? and password=?",
    regUser:"insert into t_users (`name`,`password`,`nick`) values (?,?,?)",
    regUserInfo:"insert into t_users_info (`user_id`,`email`,`invi_code`,`phone`,`avatar`,`score`,`level`,`gender`,`title`,`firstLogin`,`money`,`vipLevel`) values (?,?,?,?,?,?,?,?,?,1,?,?)",
    getLastUserIndex:"select id from t_users order by id desc limit 1",
    getUserShowInfoByNick:"select`user_id`,`avatar`,`score`,`level`,`gender`,`title`,`vipLevel` from t_users_info where user_id = (select id from t_users where nick = ? limit 1)",
    getMyInfo:"select * from t_users_info where user_id = (select id from t_users where nick = ? limit 1)"
}