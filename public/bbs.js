"use strict";

let number=0;//全投稿数が今いくつか
const bbs = document.querySelector('#bbs');
document.querySelector('#post').addEventListener('click', () => {//投稿ボタンが押されたときの処理
    const name = document.querySelector('#name').value;//投稿者を変数にいれる
    const message = document.querySelector('#message').value;//投稿ないようを変数にいれる

    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );//CHECKを消してないから，なんかおかしい部分があったらconsole.logをいじる
    const url = "/posts";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();//サーバーから送られてくるデータ（全投稿数）を返す
    })
    .then( (response) => {
        console.log( response );//投稿件数を表示しておく
        document.querySelector('#message').value = "";//本当に投稿してあるかわからないから，あえて消す
    });
});

document.querySelector('#check').addEventListener('click', () => {
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log( value );

        console.log( number );
        if( number != value ) {//numbe(クライアントから件数)がvalue(サーバからもらった全件数)が同地じゃないとき
            const params = {
                method: "POST",
                body: 'start='+number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'               
                }
            }
            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then( (response) => {
                number += response.messages.length;
                for( let mes of response.messages ) {//サーバの方で指定されたあとの番号の投稿がresponse.messages
                    console.log( mes );  // 表示する投稿
                    let cover = document.createElement('div');//１件分の投稿のための枠がcover
                    cover.className = 'cover';
                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;
                    let mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;
                    cover.appendChild( name_area );//coverの中にname_areaをくっつけなさい
                    cover.appendChild( mes_area );// 上と同じ

                    bbs.appendChild( cover );
                }
            })
        }
    });
});