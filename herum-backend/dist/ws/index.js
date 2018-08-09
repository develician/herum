"use strict";
var Router = require('koa-router');
var redis = require('redis');
// 두개의 redis 클라이언트 생성
var subscriber = redis.createClient();
subscriber.subscribe('posts'); // posts 채널 구독
var ws = new Router();
ws.get('/ws', function (ctx, next) {
    // 구독자가 message 받을 때 마다 해당 소켓에 데이터 전달
    // 연결이 끊겼을 때 취소 할 수 있도록 따로 구분해줍니다
    var listener = function (channel, message) {
        // 메시지를 그대로 전달해줍니다
        ctx.websocket.send(message);
    };
    subscriber.on('message', listener);
    // 유저가 나갔을 때
    ctx.websocket.on('close', function () {
        subscriber.removeListener('message', listener);
    });
});
module.exports = ws;
