// ================= CONFIG =================
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";
// ==========================================

fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1); // bỏ dòng tiêu đề

    const container = document.getElementById("products");
    container.innerHTML = "";

    if (rows.length === 0) {
      container.innerHTML = "<p>Không có sản phẩm</p>";
      return;
    }

    rows.forEach(row => {
      const cols = row.split(",");

      const id = cols[0];
      const ten = cols[1];
      const gia = Number(cols[2]);
      const anh = cols[3];

      if (!ten || !gia || !anh) return;

      container.innerHTML += `
        <div class="product">
          <img src="${anh}" alt="${ten}">
          <h3>${ten}</h3>
          <div class="price">${gia.toLocaleString("vi-VN")} ₫</div>
          <button onclick='addToCart(${JSON.stringify({
            id: id,
            name: ten,
            price: gia,
            image: anh
          })})'>
            Mua ngay
          </button>
        </div>
      `;
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("products").innerHTML =
      "<p>Lỗi tải sản phẩm</p>";
  });
