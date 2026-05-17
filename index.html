<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>試卷系統（免費版）</title>

<style>
body { display: flex; height: 100vh; margin: 0; font-family: sans-serif; }
.left { width: 35%; padding: 20px; background: #f5f5f5; }
.right { width: 65%; }
iframe { width: 100%; height: 100%; border: none; }
.file { background: white; margin: 5px; padding: 10px; cursor: pointer; }
</style>
</head>

<body>

<div class="left">

<h2>📤 上傳</h2>

<form id="uploadForm" target="hiddenFrame" method="POST">
  <input type="file" id="file"><br><br>
  <input type="text" id="name" placeholder="檔名"><br><br>
  <button type="submit">上傳</button>
</form>

<iframe name="hiddenFrame" style="display:none;"></iframe>

<p id="msg"></p>

<h2>📋 清單</h2>
<div id="list">載入中...</div>

</div>

<div class="right" id="viewer">
  <p style="text-align:center;margin-top:40%">點左邊查看</p>
</div>

<script>
const API = "https://script.google.com/macros/s/AKfycbyR6r33DAdATfV-Dpf5yrXa2-1fBZqUn2qCMczNAHdoOGGRX7WUfdQWhkXLNy_iQg/exec";

// 讀取清單
function load() {
  fetch(API)
    .then(r => r.text())
    .then(t => {
      const files = JSON.parse(t);
      const list = document.getElementById("list");
      list.innerHTML = "";

      files.forEach(f => {
        const div = document.createElement("div");
        div.className = "file";
        div.innerText = f.name;

        div.onclick = () => {
          document.getElementById("viewer").innerHTML =
            `<iframe src="${f.url}"></iframe>`;
        };

        list.appendChild(div);
      });
    });
}

// 上傳（iframe hack）
document.getElementById("uploadForm").onsubmit = function(e) {
  e.preventDefault();

  const file = document.getElementById("file").files[0];
  const name = document.getElementById("name").value;
  const msg = document.getElementById("msg");

  if (!file || !name) return alert("填好");

  const reader = new FileReader();

  reader.onload = function(e) {
    const base64 = e.target.result.split(",")[1];

    const form = document.createElement("form");
    form.method = "POST";
    form.action = API;
    form.target = "hiddenFrame";

    function add(name, value) {
      const input = document.createElement("input");
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    add("name", name);
    add("ext", file.name.split(".").pop());
    add("type", file.type);
    add("base64", base64);

    document.body.appendChild(form);
    form.submit();

    msg.innerText = "✅ 已上傳（刷新清單）";
    setTimeout(load, 1500);
  };

  reader.readAsDataURL(file);
};

load();
</script>

</body>
</html>
