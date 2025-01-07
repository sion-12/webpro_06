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
    .catch(error => {
        console.error('タスク追加エラー:', error);
    });

    document.querySelector('#task').value = ''; // 入力フィールドをクリア
});


function updateTaskList(tasks) {
    const taskList = document.querySelector('#todolist');
    taskList.innerHTML = ''; // 一旦リストをクリア

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskText = document.createElement('span');
        taskText.textContent = task.task;

        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = task.completed === 'completed'; // 完了している場合はチェック
        taskCheckbox.dataset.id = task.id; // IDをセット

        // チェックボックスが変更された時の処理
        taskCheckbox.addEventListener('change', () => {
            const completed = taskCheckbox.checked ? 'completed' : 'pending';
            updateTaskStatus(task.id, completed); // 完了状態をPUTメソッドで更新
        });

        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskText);
        taskList.appendChild(taskItem);
    });
}

// 完了状態を更新する関数
function updateTaskStatus(id, completed) {
    fetch(`/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: completed })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('タスク更新エラー');
        }
        return response.json();
    })
    .then(data => {
        updateTaskList(data.tasks); // タスクリストを更新
    })
    .catch(error => {
        console.error(error);
    });
}