$(document).ready(function () {
    sql.opendb();
    sql.createTable(); //第一次打开程序时执行此方法一次
    sql.ipc();
    sql.isi();
    sql.ipt();
} );