# Giao thức thực nghiệm (khóa trước khi chạy) — Experimental protocol (locked before running)

Châu Văn Vân · PTITHCM — Swarm Intelligence Textbook. Ngày khóa / locked: 2026-10-10.

Mọi con số trong slide đều lấy từ các tệp trong `results/` do các script trong `experiments/` sinh ra.
Không chỉnh tham số theo kết quả. Không chạy lại để chọn lần chạy đẹp.
Every number in the slides comes from `results/`, produced by the scripts in `experiments/`.
No parameter is tuned on the results. No run is repeated to pick a nicer outcome.

## 1. Bộ hàm liên tục / Continuous suite (chương 3–13, 16)

| ID | Hàm | Miền | f* | Ghi chú |
|----|-----|------|----|---------|
| F1 | Sphere | [-100, 100]^D | 0 | đơn đỉnh, tối ưu tại gốc |
| F2 | Rosenbrock | [-30, 30]^D | 0 | thung lũng hẹp |
| F3 | Rastrigin | [-5.12, 5.12]^D | 0 | đa đỉnh đều |
| F4 | Ackley | [-32, 32]^D | 0 | đa đỉnh, phẳng ở xa |
| F5 | Griewank | [-600, 600]^D | 0 | đa đỉnh |
| F6 | Shifted Sphere | [-100, 100]^D | 0 | tối ưu dịch khỏi gốc (o ~ U[-80, 80]^D, seed 2026) |
| F7 | Shifted Rastrigin | [-5.12, 5.12]^D | 0 | tối ưu dịch khỏi gốc (o ~ U[-4, 4]^D, seed 2026) |

F6, F7 dùng để phát hiện thiên lệch về gốc tọa độ (origin bias).

- D = 10; ngân sách / budget = 20 000 lần đánh giá hàm (2 000·D) cho **mọi** thuật toán.
- Kích thước quần thể n = 30 cho mọi thuật toán (ABC: 30 ong = 15 nguồn hoa).
- 30 lần chạy độc lập, hạt giống 1…30, giống nhau cho mọi thuật toán.
- Tham số: giá trị mặc định trong bài báo gốc hoặc mã nguồn gốc của tác giả (xem docstring từng tệp).
- Đếm đánh giá hàm thật sự: thuật toán dừng ngay khi hết ngân sách (kể cả các bước đánh giá phụ như HHO, MPA, CS).
- Chỉ số: sai số tốt nhất f(x_best) − f*; trung bình, độ lệch chuẩn, trung vị.
- Kiểm định: Wilcoxon rank-sum hai phía (α = 0.05) so với PSO; xếp hạng Friedman trên 7 hàm (theo trung vị).
- Sai số < 1e-8 được ghi là 0 khi so sánh (ngưỡng số học).

## 2. TSP (chương 4)

- Thể hiện: ví dụ 5 thành phố của Okwu & Tartibu (2021), eil51 (tối ưu 426), berlin52 (7542), st70 (675) từ TSPLIB.
- Thuật toán: Ant System, Ant Colony System, MAX–MIN Ant System, không có tìm kiếm cục bộ; mốc so sánh: láng giềng gần nhất, láng giềng gần nhất + 2-opt.
- Ngân sách: 10 000 hành trình được dựng cho mỗi lần chạy; 10 lần chạy, hạt giống 1…10.
- Chỉ số: độ dài tốt nhất, sai lệch % so với tối ưu đã biết.

## 3. Các thí nghiệm theo chương

| Chương | Thí nghiệm | Lần chạy |
|---|---|---|
| 1 | Tìm kiếm ngẫu nhiên, leo đồi (1+1)-ES, PSO trên F1, F3; PSO có hàm phạt cho ví dụ có ràng buộc của sách | 30 |
| 2 | Thống kê bước Lévy và bước Gauss; minh họa Wilcoxon/Friedman trên kết quả mục 1 | — |
| 14 | MOPSO (lưu trữ + khoảng cách đông đúc) và NSGA-II trên ZDT1, ZDT2, ZDT3 (30 biến, 25 000 đánh giá); IGD, HV | 10 |
| 15 | Binary PSO với hàm chuyển S2 và V2 trên 3 bài cái túi 0/1 (tối ưu bằng quy hoạch động); chọn đặc trưng trên Breast Cancer (KNN, CV 5 lần trên tập huấn luyện, tập kiểm tra giữ riêng) | 30 / 10 |
| 16 | GA (SBX + đột biến đa thức), PSO, GA-PSO lai, QPSO trên bộ hàm liên tục | 30 |
| 17 | Huấn luyện MLP bằng PSO so với Adam; tối ưu siêu tham số Random Forest bằng PSO so với tìm kiếm ngẫu nhiên (cùng số lần đánh giá); phân ngưỡng Otsu 2 ngưỡng bằng PSO so với vét cạn | 10 |
| 18 | CVRP: ACO so với Clarke–Wright; môi trường động (đỉnh di chuyển): PSO và PSO khởi tạo lại | 10 |
