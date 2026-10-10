"""Danh mục thuật toán liên tục: tên -> hàm run(prob, rng, n=30)."""
from . import pso, acor, abc, fa, alo, mfo, goa, boa, hho, gwo, woa, ba, rco, mpa, ssa, aaa, bfo, cs

REGISTRY = {
    'PSO': pso.run, 'ACOR': acor.run, 'ABC': abc.run, 'FA': fa.run,
    'ALO': alo.run, 'MFO': mfo.run, 'GOA': goa.run, 'BOA': boa.run,
    'HHO': hho.run, 'GWO': gwo.run, 'WOA': woa.run, 'BA': ba.run, 'RCO': rco.run,
    'MPA': mpa.run, 'SSA': ssa.run, 'AAA': aaa.run, 'BFO': bfo.run, 'CS': cs.run,
}

# Thuật toán dùng ở chương 1 và 16 (không thuộc bộ so sánh chính)
from . import ga, qpso, gapso
from .. import applications as _app
EXTRA = {'GA': ga.run, 'QPSO': qpso.run, 'GAPSO': gapso.run, 'RS': _app.random_search, 'ES11': _app.one_plus_one_es}
