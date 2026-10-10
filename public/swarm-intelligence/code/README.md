# Swarm Intelligence Textbook — mã nguồn và thực nghiệm / code and experiments

Châu Văn Vân · PTITHCM

Mỗi thuật toán trong giáo trình được cài đặt bằng Python (NumPy) theo bài báo gốc, chạy trên cùng một giao thức
đã khóa trước (`PROTOCOL.md`), và mọi con số trong slide được đọc từ `results/`.
Every algorithm in the textbook is implemented in Python (NumPy) after its original paper, run under one protocol
locked in advance (`PROTOCOL.md`), and every number in the slides is read from `results/`.

## Cấu trúc / Layout

| Thư mục / Folder | Nội dung / Contents |
|---|---|
| `si/core.py` | `Problem`: đếm số lần đánh giá, dừng đúng ngân sách; bước Lévy (Mantegna) / evaluation counting, Lévy steps |
| `si/benchmarks.py` | F1–F7 (Sphere, Rosenbrock, Rastrigin, Ackley, Griewank, Sphere và Rastrigin dịch tâm) + các hàm 2 biến |
| `si/algorithms/` | 18 thuật toán bầy đàn (PSO, ACO_R, ABC, FA, ALO, MFO, GOA, BOA, HHO, GWO, WOA, BA, RCO, MPA, SSA, AAA, BFO, CS) và GA, QPSO, GA-PSO, tìm kiếm ngẫu nhiên, (1+1)-ES |
| `si/aco_tsp.py` | Ant System, ACS, MMAS cho TSP; láng giềng gần nhất, 2-opt |
| `si/multiobjective.py` | ZDT1–3, MOPSO, NSGA-II (pymoo), IGD, hypervolume |
| `si/binary.py` | Hàm chuyển S1–S4, V1–V4; Binary PSO; cái túi 0/1; chọn đặc trưng |
| `si/applications.py` | Ràng buộc + hàm phạt, MLP, Otsu, CVRP (Clarke–Wright, ACO), PSO trong môi trường động |
| `experiments/` | Script chạy thực nghiệm và phân tích thống kê |
| `results/` | Kết quả thô (CSV) và tổng hợp (JSON, SVG) |
| `refs/` | DOI theo chương, siêu dữ liệu Crossref, tài liệu tham khảo dạng IEEE |
| `data/` | eil51, berlin52, st70 (TSPLIB) |

## Chạy lại / Reproduce

```bash
pip install numpy scipy scikit-learn matplotlib pymoo
cd code
python -m experiments.run_continuous                    # 18 thuật toán × 7 hàm × 30 lần chạy
python -m experiments.run_continuous --algos GA,QPSO,GAPSO,RS,ES11 --out results/extra
python -m experiments.analyze results/continuous        # Wilcoxon, Friedman, đường hội tụ → results/summary
python -c "from experiments.analyze import main; main(['results/continuous', 'results/extra'], 'results/summary_all')"
python -m experiments.run_tsp                           # chương 4
python -m experiments.run_chapters ch1 ch2 ch14 ch15 ch17 ch18
```

Cài đặt dùng tham số mặc định của bài gốc; không chỉnh tham số theo kết quả. Các kết quả âm (ví dụ RCO, BFO đứng cuối;
HHO, WOA, BOA thiên lệch về gốc tọa độ; Adam thắng PSO khi huấn luyện MLP) được giữ nguyên và trình bày trong slide.
Default parameters from the original papers are used; nothing is tuned on the results. Negative findings are kept and shown.
