let taskList = [
    {
        taskStatus: false,
        description: "Workout",
        priority: "low",
        taskId: 1
    },
    {
        taskStatus: false,
        description: "reading books",
        priority: "low",
        taskId: 2
    }
];
const priorityCSSClass={
    low:"low",
    medium : "medium",
}
const TASKS = document.querySelector('.task')
const input = document.querySelector('.input')
const addbtn = document.querySelector('#add')
const delallbtn = document.querySelector('#yes')
const no = document.querySelector('#no')
const de = document.querySelector('#del')
const per = document.querySelector('.per')
const update = document.querySelector('.update')
const selector = document.querySelector('.priselect')
const all = document.querySelector('#all')
const complete = document.querySelector('#com')
const incomplete = document.querySelector('#incom');
const todo = document.querySelector('.todo');
const cancel = document.querySelector('#cancel');
const next = document.querySelector('#next');

all.addEventListener('click', function () { render(); });
incomplete.addEventListener('click', function () {
    render('incomplete');
});
complete.addEventListener('click', function () { render('complete'); });

no.addEventListener('click', function () {
    per.style.display = 'none';
});

de.addEventListener('click', function () {
    per.style.display = "block"
})

addbtn.addEventListener('click', function () {
    let mtask = input.value.trim();
    let priority = selector.value;
    if (mtask) {
        addTask(mtask, priority);
    }
    input.value = '';
    selector.value = 'low';
    // savetool();
    render();

})
delallbtn.addEventListener('click', function () {
    deleteallTasks();
    per.style.display = "none"
})

function updateTaskCounts() {
    update.innerHTML = `Total Tasks: ${noOfTasks()}, Incomplete: ${noOfInCompleteTasks()}, Complete: ${noOfCompleteTasks()}`;
    update.style.color = "white";
}



function addTask(description, priority) {
    let id = taskList.length ? taskList[taskList.length - 1].taskId + 1 : 0;
    // console.log("hii")
    let content = {
        taskStatus: false,
        description: description,
        priority: priority,
        taskId: id,
    }
    taskList.push(content);
    savetool();
    render();
}
function deleteTask(taskId) {
    taskList = taskList.filter(task => task.taskId !== taskId);
    savetool();
    getFrom();
    render();

}
function editTask(id, newDescription) {
    const task = taskList.find(function (t) {
        return t.taskId === id
    });
    if (task) {
        task.description = newDescription;
        savetool();
        getFrom();
        render();  // Re-render after editing
    }
}

function noOfTasks() {
    return taskList.length;
}
function noOfInCompleteTasks() {
    let incomplete = taskList.filter(function (st) {
        return st.taskStatus == false;
    }).length;

    // console.log("Incomplete task:"+incomplete);
    return incomplete;
}
function noOfCompleteTasks() {
    let complete = taskList.filter(function (sta) {
        return sta.taskStatus == true;
    }).length;
    // console.log("Complted Task:"+complete);
    return complete;

}
function deleteallTasks() {
    taskList.splice(0);
    savetool();
    getFrom();
    render();
}

function savetool() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
}
function getFrom() {
    return JSON.parse(localStorage.getItem("tasks"));
}

let nota = document.querySelector(".task");
let found = document.querySelector(".notfound")
let title = document.querySelector(".title")
function notask() {
    //     let tasklistlen = taskList.length;
    if (taskList.length === 0) {
        nota.style.display = "none";
        title.style.display = "none";
        found.style.display = "flex";
    }
    else {
        nota.style.display = "flex";
        title.style.display = "flex";
        found.style.display = "none";
    }
}
notask();


function render(filterby) {
    taskList = getFrom();
    TASKS.innerHTML = "";
    let filteredTasks = taskList;

    if (filterby === 'incomplete') {
        filteredTasks = taskList.filter(function (task) {
            return !task.taskStatus
        });
    } else if (filterby === 'complete') {
        filteredTasks = taskList.filter(function (task) {
            return task.taskStatus
        });
    }

    filteredTasks.forEach(function (t) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskitems');

        function crt() {
            if (t.taskStatus) {
                // toggleBtn.innerHTML='<i class="fa-solid fa-xmark"></i>';
                taskDiv.classList.add('completed')
                taskDes.style.textDecoration = "line-through";
            } else {
                taskDiv.classList.remove('completed');
                taskDes.style.textDecoration = "none";
            }

        }
        const taskDes = document.createElement('p');
        taskDes.innerText = `${t.description} Priority: ${t.priority}`;
        taskDes.classList.add("desc");

        taskDiv.classList.add(priorityCSSClass[t.priority]);

        switch (t.priority) {
            case 'high':
                taskDiv.style.borderLeft = '10px solid #FFCCCC';
                break;
            case 'medium':
                taskDiv.style.borderLeft = '10px solid #FFFF99'; // Yellow for medium priority
                break;
            case 'low':
                taskDiv.style.borderLeft = '10px solid #CCE5FF'; // Yellow for medium priority
                break;
            default:
                taskDiv.style.borderLeft = 'lightgreen'; // Green for low priority
                break;
        }

        const delbtn = document.createElement('button');
        delbtn.innerHTML = '<i class="fa-solid fa-square-minus"></i>';
        delbtn.classList.add("del");
        delbtn.addEventListener('click', function () {
            deleteTask(t.taskId);
        })

        const toggleBtn = document.createElement('button');
        toggleBtn.classList.add("tog")
        toggleBtn.innerHTML = t.taskStatus ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-check"></i>';
        crt();

        toggleBtn.addEventListener('click', function () {
            t.taskStatus = !t.taskStatus;

            crt();
            updateTaskCounts();
            savetool();
            getFrom()
            render();
        });

        const btns = document.createElement("div")
        btns.classList.add('btn')

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = t.description;
        editInput.style.display = 'none';
        editInput.classList.add('edinput')

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editBtn.classList.add('edit')
        editBtn.addEventListener('click', function () {
            if (editInput.style.display === 'none') {
                taskDes.style.display = 'none';
                editInput.style.display = 'block';
                delbtn.style.display = 'none';
                toggleBtn.style.display = 'none';
            } else {
                taskDes.style.display = 'block';
                editInput.style.display = 'none';
                t.description = editInput.value; // Save edited value
                editTask(t.taskId, editInput.value);
                delbtn.style.display = 'block';
                toggleBtn.style.display = 'block';
            }
        })

        taskDiv.appendChild(taskDes);
        taskDiv.appendChild(btns);
        btns.appendChild(delbtn);
        btns.appendChild(editInput);
        btns.appendChild(editBtn);
        btns.appendChild(toggleBtn);
        TASKS.appendChild(taskDiv);

    })
    notask();
    updateTaskCounts();
}

// todo.addEventListener('click',function(){
// setTourPosition(allTaskTour,_(allElementRef[0],0));
// })

function _(selector) {
    return document.getElementById(selector);
}

function __(selector) {
    return document.querySelector(selector);
}

let triangleIcon = __(".fa-caret-down");
let allTaskTour = __(".t1");
let tourContent = __('.t1 > p');
let allElementRef = ["#all", "#com", "#incom", ".del", ".edit", ".tog", "#add", "#del"];

cancel.addEventListener('click', function () {
    __(".bgguide").style.display = "none";
});

setTourPosition(allTaskTour, __(allElementRef[0]), 0);

setTimeout(function () {
    __(".bgguide").style.display = "block";
}, 1000);

let currenttourNo = 1;
next.addEventListener('click', function () {
    if (currenttourNo >= allElementRef.length) {
        currenttourNo = 0;
        __(".bgguide").style.display = "none";
    }
    let element = allElementRef[currenttourNo];
    let nelement = __(element);
    setTourPosition(allTaskTour, nelement, currenttourNo);
    currenttourNo++;
});

function setTourPosition(tour, element, currenttour) {
    let elementrefPos = element.getBoundingClientRect();
    element.classList.add("elementAct");
    tour.classList.add("tourAct");

    let topOff = elementrefPos.top + window.scrollY;
    let leftOff = elementrefPos.left + window.scrollX;

    if (currenttour === 0) {
        topOff -= 113;
        leftOff -= 10;
        tourContent.textContent = "Click To Show The All Tasks Present In the Todo!";

    } else if (currenttour === 1) {
        topOff -= 112;
        leftOff += 30;
        tourContent.textContent = "Click To Show The Completed Tasks In Todo!";
        // __(allElementRef[2]).classList.remove("elementAct");
        __(allElementRef[0]).classList.remove("elementAct");
        // __(allElementRef[3]).classList.remove("elementAct");
        // __(allElementRef[4]).classList.remove("elementAct");
        // __(allElementRef[5]).classList.remove("elementAct");
    } else if (currenttour === 2) {
        topOff -= 112;
        leftOff += 30;
        tourContent.textContent = "Click To Show The Incompleted Tasks In Todo!";
        __(allElementRef[0]).classList.remove("elementAct");
        __(allElementRef[1]).classList.remove("elementAct");
        // __(allElementRef[3]).classList.remove("elementAct");
        // __(allElementRef[4]).classList.remove("elementAct");
        // __(allElementRef[5]).classList.remove("elementAct");
    }
    else if (currenttour === 3) {
        topOff -= 100;
        leftOff -= 5;
        tourContent.textContent = "Click To Delete The Tasks In Todo!";
        __(allElementRef[0]).classList.remove("elementAct");
        __(allElementRef[1]).classList.remove("elementAct");
        __(allElementRef[2]).classList.remove("elementAct");
        // __(allElementRef[4]).classList.remove("elementAct");
        // __(allElementRef[5]).classList.remove("elementAct");
    } else if (currenttour === 4) {
        topOff -= 100;
        leftOff -= 5;
        tourContent.textContent = "Click To Edit The Tasks In Todo!";
        __(allElementRef[0]).classList.remove("elementAct");
        __(allElementRef[1]).classList.remove("elementAct");
        __(allElementRef[2]).classList.remove("elementAct");
        __(allElementRef[3]).classList.remove("elementAct");
        // __(allElementRef[5]).classList.remove("elementAct");
    } else if (currenttour === 5) {
        topOff -= 110;
        leftOff -= 3;
        tourContent.textContent = "Click To Complete The Tasks In Todo!";
        __(allElementRef[0]).classList.remove("elementAct");
        __(allElementRef[1]).classList.remove("elementAct");
        __(allElementRef[2]).classList.remove("elementAct");
        __(allElementRef[4]).classList.remove("elementAct");
        __(allElementRef[3]).classList.remove("elementAct");
    } else if (currenttour === 6) {
        topOff -= 100;
        leftOff += 10;
        tourContent.textContent = "Click To Add The Tasks In Todo!";
        __(allElementRef[0]).classList.remove("elementAct");
        __(allElementRef[1]).classList.remove("elementAct");
        __(allElementRef[2]).classList.remove("elementAct");
        __(allElementRef[4]).classList.remove("elementAct");
        __(allElementRef[3]).classList.remove("elementAct");
        __(allElementRef[5]).classList.remove("elementAct");
    } else if (currenttour === 7) {
        topOff -= 122;
        leftOff += 10;
        tourContent.textContent = "Click To Delete All The Tasks In Todo!";
        __(allElementRef[0]).classList.remove("elementAct");
        __(allElementRef[1]).classList.remove("elementAct");
        __(allElementRef[2]).classList.remove("elementAct");
        __(allElementRef[4]).classList.remove("elementAct");
        __(allElementRef[3]).classList.remove("elementAct");
        __(allElementRef[5]).classList.remove("elementAct");
        __(allElementRef[6]).classList.remove("elementAct");
    }




    tour.style.top = topOff + "px";
    tour.style.left = leftOff + "px";
}


render();

notask();
