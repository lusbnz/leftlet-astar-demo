- npm install
- lên open street map tải file xml về (bỏ qua bước này cũng được)
- npm run graph để generate json
- npm run serve

---

- osm-parser.js dùng để viết các hàm chuyển đổi, output trả ra các hàm lấy điểm, vẽ điểm, vẽ đường, tạo đồ thị
- map.osm là file data lấy từ open street map về
- index.js dùng để đọc file map.osm sử dụng các hàm mà osm-parser.js trả ra để tạo ra file map.json
- a-star.js xử lý thuật toán a-star
- map.json lấy dữ liệu cần thiết từ file map.osm
- index.html hiển thị giao diện sử dụng leaflet và open street map

---

map [21.04069, 105.78959]
map2 [42.3599990, -71.0600000]
