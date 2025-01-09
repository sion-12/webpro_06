"use strict";

// タスクを追加する処理
document.querySelector('#addtask').addEventListener('click', () => {
    const task = document.querySelector('#task').value; // 入力されたタスク内容を変数にいれる

    const params = {
        method: 'POST',
        body: 'task=' + task,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    console.log(params);

    fetch('/post', params)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();  // サーバーから送られてきたデータ（タスクリスト）を返す
    })
    .then(data => {
        console.log(data);  // サーバーから受け取ったデータを表示
        updateTaskList(data.tasks); // サーバから返されたタスクリストを使う
    })
    
    document.querySelector('#task').value = ''; // 入力フィールドをクリア
});


function updateTaskList(tasks) {
    const taskList = document.querySelector('#todolist');
    taskList.innerHTML = ''; // 一旦リストをクリア

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const taskText = document.createElement('span');
        taskText.innerText = task.task;
        taskText.className = 'task-Text';

        const taskCheckbox = document.createElement('input');
        taskCheckbox.className = 'task-Checkbox';
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = task.completed === 'completed'; // 完了している場合はチェック
        taskCheckbox.dataset.id = task.id; // IDをセット

        taskCheckbox.addEventListener('change', () => {
            let completed;
            if (taskCheckbox.checked) {
                completed = 'completed'; // チェックされていれば 'completed'
            } else {
                completed = 'pending'; // チェックされていなければ 'pending'
            }
        
            const paramss = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `completed=${completed}`  // URLエンコード形式でデータを送信
            };

            fetch(`/update/${task.id}`, paramss)
            .then(response => {
            if (!response.ok) {
            throw new Error('タスク更新エラー');
            }
            return response.json();
            })
            .then(data => {
            updateTaskList(data.tasks); // タスクリストを更新
            })   
        });
        
        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskText);
        taskList.appendChild(taskItem);
    });
}

