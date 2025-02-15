let uniq = JSON.parse(localStorage.getItem("id")) || 0;
let resUniq = JSON.parse(localStorage.getItem("resId")) || 0;
let arr = JSON.parse(localStorage.getItem("list")) || [];

let text1 = document.getElementById("text1");
let text2 = document.getElementById("text2");
let text3 = document.getElementById("text3");
let text4 = document.getElementById("text4");

let q_list = document.getElementById("q_list");
let sec1 = document.getElementById("sec1");
let sec2_1 = document.getElementById("sec2_1");
let sec2_2 = document.getElementById("sec2_2");
let response = document.getElementById("response");

let ques_id = null;

function display1() {
    sec2_1.classList.add("display");
    sec2_2.classList.remove("display");
}

function display2() {
    sec2_1.classList.remove("display");
    sec2_2.classList.add("display");
}

function showTime(timestamp) {
    let now = new Date();
    let time_diff = now - new Date(timestamp);
    let minutes = Math.floor(time_diff / 60000);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    if (days == 1) return "1 day";
    else if (days > 1) return `${days} days`;
    else if (hours == 1) return "1 hour";
    else if (hours > 1) return `${hours} hours`;
    else if (minutes == 1) return "1 minute";
    else if (minutes > 1) return `${minutes} minutes`;
    else return "Just Now";
}

function updateTimestamps() {
    document.querySelectorAll(".timestamp").forEach((ele) => {
        let timestamp = ele.dataset.timestamp;
        ele.textContent = showTime(timestamp);
    });
}

function reload() {
    q_list.innerHTML = "";

    let sortedArr = [...arr].sort((a, b) => {
        if (a.starred == b.starred) {
            return a.original_index - b.original_index;
        }
        return b.starred - a.starred;
    });

    sortedArr.forEach((item) => {
        let div = document.createElement("div");
        div.classList.add("item");
        div.id = `item-${item.id}`;
        div.innerHTML = `
            <div class="ques_head">
                <h1>${item.sub}</h1>
                <div>
                    <div class="timestamp" data-timestamp="${item.timestamp}">
                        ${showTime(item.timestamp)}
                    </div>
                    <span class="star" data-id="${item.id}">
                        ${item.starred ? '🌟' : '☆'}
                    </span>
                </div>
            </div>
            <hr>
            ${item.ques}
        `;
        q_list.appendChild(div);
    });

    if (arr.length == 0) {
        uniq = 0;
        localStorage.setItem("id", 0);
        resUniq = 0;
        localStorage.setItem("resId", 0);
    }
}

function reloadres(item) {
    let sortedResponses = [...item.responses].sort((a, b) => {
        let diffA = (a.likes || 0) - (a.dislikes || 0);
        let diffB = (b.likes || 0) - (b.dislikes || 0);
        return diffB - diffA;
    });

    response.innerHTML = "";

    sortedResponses.forEach((res) => {
        let div = document.createElement("div");
        div.classList.add("item2");
        div.innerHTML = `
            <div class="res_head">
                <h1>${res.name}</h1>
                <div>
                    <span class="likes" data-ques-id="${item.id}" data-res-id="${res.id}">
                        👍 ${res.likes || 0}
                    </span>
                    <span class="dislikes" data-ques-id="${item.id}" data-res-id="${res.id}">
                        👎 ${res.dislikes || 0}
                    </span>
                </div>
            </div>
            <hr>
            ${res.comment}
        `;
        response.appendChild(div);
    });
}

document.getElementById("submit").addEventListener("click", () => {
    if(text1.value==""||text2.value==""){
        alert("Please fill in all fields");
    }
    else{
        let timestamp = new Date().toISOString();
        let div = document.createElement("div");
        div.classList.add("item");
        div.id = `item-${uniq}`;
        div.innerHTML = `
            <div class="ques_head">
                <h1>${text1.value}</h1>
                <div>
                    <div class="timestamp" data-timestamp="${timestamp}">
                        ${showTime(timestamp)}
                    </div>
                    <span class="star" data-id="${uniq}">☆</span>
                </div>
            </div>
            <hr>
            ${text2.value}
        `;
    
        q_list.appendChild(div);
    
        let ob = {
            id: uniq,
            sub: text1.value,
            ques: text2.value,
            responses: [],
            starred: false,
            original_index: arr.length,
            timestamp: timestamp,
        };
    
        arr.push(ob);
        uniq++;
        localStorage.setItem("id", JSON.stringify(uniq));
        localStorage.setItem("list", JSON.stringify(arr));
    
        text1.value = "";
        text2.value = "";
        updateTimestamps();
    }
});

q_list.addEventListener("click", (e) => {
    if (e.target.classList.contains("star")) {
        let id = e.target.dataset.id;
        let index = arr.findIndex((item) => item.id == id);

        if (index > -1) {
            arr[index].starred = !arr[index].starred;
            localStorage.setItem("list", JSON.stringify(arr));
            reload();
        }
    } else if (e.target.closest(".item")) {
        display1();
        let id = e.target.closest(".item").id.split("-")[1];
        ques_id = id;
        let item = arr.find((item) => item.id == id);

        if (item) {
            let ques = document.getElementById("ques");
            ques.innerHTML = "";

            let div = document.createElement("div");
            div.innerHTML = `<h1>${item.sub}</h1><hr>${item.ques}`;
            div.classList.add("item2");

            ques.appendChild(div);
            reloadres(item);
        }
    }
});

document.getElementById("submit2").addEventListener("click", () => {
    if(text3.value==""||text4.value==""){
        alert("Please fill in all fields");
    }
    else{
        let ob2 = {
            id: resUniq++,
            name: text3.value,
            comment: text4.value,
            likes: 0,
            dislikes: 0,
        };
    
        let ele = arr.find((el) => el.id == ques_id);
    
        if (ele) {
            ele.responses.push(ob2);
            localStorage.setItem("list", JSON.stringify(arr));
            localStorage.setItem("resId", JSON.stringify(resUniq));
            reloadres(ele);
        }
    
        text3.value = "";
        text4.value = "";
    }
    
});

document.getElementById("new_ques").addEventListener("click", () => {
    display2();
});

document.getElementById("search").addEventListener("input", (e) => {
    let search_item = document.getElementById("search").value.toLowerCase();
    let all_item = document.querySelectorAll("#sec1 .item");
    let found = false;

    all_item.forEach((item) => {
        let heading = item.querySelector("h1");

        if (heading && heading.textContent.toLowerCase().includes(search_item)) {
            item.style.display = "block";
            found = true;
        } else {
            item.style.display = "none";
        }
    });

    if (!found) {
        if (!document.getElementById("notfound")) {
            q_list.innerHTML += "<h1 id='notfound' style='margin-top:35px;'>NO MATCH FOUND!</h1>";
        }
    } else {
        let notFoundElement = document.getElementById("notfound");
        if (notFoundElement) notFoundElement.remove();
    }
});

document.getElementById("resolve").addEventListener("click", () => {
    let updated_arr = arr.filter((item) => item.id != ques_id);
    arr = updated_arr;
    localStorage.setItem("list", JSON.stringify(arr));
    reload();
    display2();
});

response.addEventListener("click", (e) => {
    if (e.target.classList.contains("likes") || e.target.classList.contains("dislikes")) {
        let quesId = e.target.dataset.quesId;
        let resId = e.target.dataset.resId;
        let quesItem = arr.find((q) => q.id == quesId);
        let resItem = quesItem.responses.find((r) => r.id == resId);

        if (resItem) {
            if (e.target.classList.contains("likes")) {
                resItem.likes++;
            } else if (e.target.classList.contains("dislikes")) {
                resItem.dislikes++;
            }

            localStorage.setItem("list", JSON.stringify(arr));
            reloadres(quesItem);
        }
    }
});

document.getElementById("reset").addEventListener("click", () => {
    text1.value = "";
    text2.value = "";
});

document.getElementById("reset2").addEventListener("click", () => {
    text3.value = "";
    text4.value = "";
});

setInterval(updateTimestamps, 60000);

reload();
