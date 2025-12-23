const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);
    const container = document.getElementById("products");
    container.innerHTML = "";

    rows.forEach(row => {
      // PARSE CSV ĐÚNG (chỉ tách 4 cột đầu)
      const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!cols || cols.length < 4) return;

      const id = cols[0];
      const ten = cols[1];
      const gia = Number(cols[2]);
      const anh = cols[3].replace(/"/g, "").trim();

      if (!ten || !gia || !anh) return;

      container.innerHTML += `
        <div class="product">
          <img src="${encodeURI(anh)}" alt="${ten}" loading="lazy">
          <h3>${ten}</h3>
          <div class="price">${gia.toLocaleString("vi-VN")} ₫</div>
          <button onclick='addToCart(${JSON.stringify({
            id,
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
