const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";
const NO_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

/* ===== LOAD LIST ===== */
document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("products");
  if (!box) return;

  fetch(CSV_URL).then(r=>r.text()).then(t=>{
    t.trim().split("\n").slice(1).forEach(r=>{
      const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if(!c[0]||!c[1]) return;
      box.innerHTML += `
      <div class="product">
        <a href="product.html?id=${c[0]}">
          <img src="${c[3]||NO_IMAGE}">
        </a>
        <h3>${c[1]}</h3>
        <div class="price">${Number(c[2]).toLocaleString("vi-VN")} ₫</div>
        <button class="buy-btn">Thêm vào giỏ</button>
      </div>`;
    });
  });
});

/* ===== DETAIL ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const d = document.getElementById("productDetail");
  if(!d) return;
  const id = new URLSearchParams(location.search).get("id");

  fetch(CSV_URL).then(r=>r.text()).then(t=>{
    t.trim().split("\n").slice(1).forEach(r=>{
      const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if(c[0]!==id) return;

      d.innerHTML = `
      <div class="product-detail">
        <img src="${c[3]||NO_IMAGE}" onclick="openImage('${c[3]}')">
        <h3>${c[1]}</h3>
        <div class="detail-price">${Number(c[2]).toLocaleString("vi-VN")} ₫</div>

        <div class="tabs">
          <button class="tab-btn active" onclick="openTab(event,'tp')">Thành phần</button>
          <button class="tab-btn" onclick="openTab(event,'hd')">Hướng dẫn</button>
          <button class="tab-btn" onclick="openTab(event,'dg')">Đánh giá</button>
        </div>

        <div id="tp" class="tab-content active">${c[4]||""}</div>
        <div id="hd" class="tab-content">${c[5]||""}</div>
        <div id="dg" class="tab-content">${c[6]||""}</div>

        <button class="buy-btn">🛒 Thêm vào giỏ</button>
      </div>`;
    });
  });
});

/* ===== TAB ===== */
function openTab(e,id){
  document.querySelectorAll(".tab-content").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(x=>x.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  e.target.classList.add("active");
}

/* ===== POPUP ===== */
function openImage(src){
  document.getElementById("popupImg").src = src;
  document.getElementById("imgPopup").style.display="flex";
}
function closeImage(){
  document.getElementById("imgPopup").style.display="none";
}
