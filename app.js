const API = "https://script.google.com/macros/s/AKfycbyR6r33DAdATfV-Dpf5yrXa2-1fBZqUn2qCMczNAHdoOGGRX7WUfdQWhkXLNy_iQg/exec"

document.addEventListener("DOMContentLoaded", load);

// 讀取清單
function load() {
  fetch(API + "?t=" + Date.now())
    .then(r => r.text())
    .then(t => {
      const data = JSON.parse(t);
      const list = document.getElementById("list");

      list.innerHTML = "";

      if (!data.files || data.files.length === 0) {
        list.innerHTML = "沒有檔案";
        return;
      }

      data.files.forEach(f => {
        const div = document.createElement("div");
        div.className = "file";
        div.innerText = f.name;

        div.onclick = () => {
          document.getElementById("viewer").innerHTML =
            `<iframe src="${f.url}"></iframe>`;
        };

        list.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("list").innerText = "❌ 無法連線（iPad限制或網址錯）";
    });
}

// 上傳
function upload() {
  const file = document.getElementById("file").files[0];
  const name = document.getElementById("name").value;
  const msg = document.getElementById("msg");

  if (!file) return alert("請選擇檔案");
  if (!name) return alert("請輸入名稱");

  msg.innerText = "處理中...";

  const reader = new FileReader();

  reader.onload = e => {
    const base64 = e.target.result.split(",")[1];

    const form = new FormData();
    form.append("customName", name);
    form.append("fileExtension", file.name.split(".").pop());
    form.append("mimeType", file.type);
    form.append("base64", base64);

    fetch(API, {
      method: "POST",
      body: form
    })
      .then(r => r.text())
      .then(t => {
        const data = JSON.parse(t);

        if (data.status === "success") {
          msg.innerText = "✅ 上傳成功";
          load();
        } else {
          msg.innerText = "❌ 上傳失敗";
        }
      })
      .catch(err => {
        console.error(err);
        msg.innerText = "❌ iPad 擋掉 / 網絡問題";
      });
  };

  reader.readAsDataURL(file);
}
