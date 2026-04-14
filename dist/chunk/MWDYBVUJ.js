import { cn } from './CZPH5U6S.js';
import { use, effect, className, setAttribute, template } from 'solid-js/web';
import { splitProps, createSignal, onMount, createEffect, untrack, onCleanup, createMemo, createRoot } from 'solid-js';

var _tmpl$ = /* @__PURE__ */ template(`<div><canvas>`);
function deepMerge(base, override) {
  const result = {
    ...base
  };
  for (const key of Object.keys(override)) {
    const bv = base[key];
    const ov = override[key];
    if (ov !== null && typeof ov === "object" && !Array.isArray(ov) && bv !== null && typeof bv === "object" && !Array.isArray(bv)) {
      result[key] = deepMerge(bv, ov);
    } else if (ov !== void 0) {
      result[key] = ov;
    }
  }
  return result;
}
function isDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}
var sharedDarkSignal = null;
var sharedDarkRefCount = 0;
function getSharedDark() {
  if (!sharedDarkSignal) {
    createRoot(() => {
      const [dark, setDark] = createSignal(isDark());
      let observer = null;
      sharedDarkSignal = {
        dark,
        subscribe() {
          sharedDarkRefCount++;
          if (sharedDarkRefCount === 1 && typeof document !== "undefined") {
            observer = new MutationObserver(() => setDark(isDark()));
            observer.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ["class"]
            });
          }
        },
        unsubscribe() {
          sharedDarkRefCount--;
          if (sharedDarkRefCount <= 0 && observer) {
            observer.disconnect();
            observer = null;
            sharedDarkRefCount = 0;
          }
        }
      };
    });
  }
  return sharedDarkSignal;
}
var THEME = {
  gridColor: (dark) => dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
  tickColor: (dark) => dark ? "#a1a1aa" : "#52525b",
  textColor: (dark) => dark ? "#e4e4e7" : "#18181b",
  subtitleColor: (dark) => dark ? "#a1a1aa" : "#52525b",
  tooltipBg: (dark) => dark ? "#1e2328" : "#ffffff",
  tooltipBorder: (dark) => dark ? "#3f3f46" : "#e4e4e7"
};
function getThemeOptions(dark, type) {
  const textColor = THEME.textColor(dark);
  const opts = {
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      },
      title: {
        color: textColor
      },
      subtitle: {
        color: THEME.subtitleColor(dark)
      },
      tooltip: {
        titleColor: textColor,
        bodyColor: textColor,
        backgroundColor: THEME.tooltipBg(dark),
        borderColor: THEME.tooltipBorder(dark),
        borderWidth: 1
      }
    }
  };
  const gridColor = THEME.gridColor(dark);
  const tickColor = THEME.tickColor(dark);
  if (type === "line" || type === "bar" || type === "scatter" || type === "bubble") {
    opts.scales = {
      x: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: tickColor
        }
      },
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: tickColor
        }
      }
    };
  }
  if (type === "radar" || type === "polarArea") {
    opts.scales = {
      r: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: tickColor,
          backdropColor: "transparent"
        }
      }
    };
  }
  return opts;
}
function getSegmentBorderForMode(dark) {
  return dark ? {
    borderColor: "rgba(255,255,255,0.25)",
    borderWidth: 1
  } : {
    borderColor: "rgba(0,0,0,0.08)",
    borderWidth: 1
  };
}
function applySegmentBorders(chartInstance, type, dark) {
  if (type !== "doughnut" && type !== "pie") return;
  const {
    borderColor,
    borderWidth
  } = getSegmentBorderForMode(dark);
  chartInstance.data.datasets.forEach((ds) => {
    const len = "data" in ds && Array.isArray(ds.data) ? ds.data.length : 0;
    ds.borderColor = Array(len).fill(borderColor);
    ds.borderWidth = borderWidth;
  });
  chartInstance.update("none");
}
function buildConfig(type, data, dark, optionsOverride, lineFill, borderWidthProp) {
  const segmentBorder = type === "doughnut" || type === "pie" ? getSegmentBorderForMode(dark) : null;
  const isLine = type === "line";
  const themeOpts = getThemeOptions(dark, type);
  const gridColor = THEME.gridColor(dark);
  const tickColor = THEME.tickColor(dark);
  const isScatterOrBubble = type === "scatter" || type === "bubble";
  const datasets = data.datasets.map((ds) => {
    if (isScatterOrBubble) {
      return {
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.backgroundColor,
        borderColor: ds.borderColor
      };
    }
    const len = ds.data.length;
    const defaultBorderWidth = isLine ? 2 : segmentBorder?.borderWidth ?? 0;
    const out = {
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.backgroundColor,
      borderColor: ds.borderColor,
      hoverBackgroundColor: ds.hoverBackgroundColor,
      hoverBorderColor: ds.hoverBorderColor,
      borderWidth: borderWidthProp ?? defaultBorderWidth,
      tension: isLine ? 0.3 : 0,
      fill: isLine ? lineFill ?? false : void 0
    };
    if (segmentBorder && !ds.borderColor) {
      out.borderColor = Array(len).fill(segmentBorder.borderColor);
    }
    return out;
  });
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...themeOpts?.plugins ?? {},
      legend: {
        position: "bottom",
        ...themeOpts?.plugins?.legend ?? {}
      }
    },
    ...isLine || type === "bar" ? {
      scales: {
        x: {
          grid: {
            display: false,
            color: gridColor
          },
          ticks: {
            color: tickColor
          }
        },
        y: {
          beginAtZero: true,
          grace: "5%",
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor
          }
        }
      }
    } : {},
    ...isScatterOrBubble ? {
      scales: {
        x: {
          type: "linear",
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor
          }
        },
        y: {
          type: "linear",
          beginAtZero: true,
          grace: "5%",
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor
          }
        }
      }
    } : {},
    ...type === "radar" || type === "polarArea" ? {
      scales: themeOpts?.scales
    } : {}
  };
  const base = {
    type,
    data: {
      labels: data.labels,
      datasets
    },
    options: optionsOverride ? deepMerge(baseOpts, optionsOverride) : baseOpts
  };
  return base;
}
function Chart(props) {
  const [local] = splitProps(props, ["type", "data", "fill", "borderWidth", "options", "aria-label", "aria-labelledby", "class"]);
  let canvasEl;
  let chartInstance = null;
  let ChartConstructor = null;
  const [chartReady, setChartReady] = createSignal(false);
  const sharedDark = getSharedDark();
  const dark = sharedDark.dark;
  const [currentType, setCurrentType] = createSignal(local.type);
  let skipNextUpdate = false;
  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }
  function createChart(type) {
    if (!canvasEl || !ChartConstructor) return;
    destroyChart();
    const config = buildConfig(type, local.data, dark(), local.options, local.fill, local.borderWidth);
    chartInstance = new ChartConstructor(canvasEl, config);
    if (type === "doughnut" || type === "pie") {
      applySegmentBorders(chartInstance, type, dark());
    }
    setCurrentType(type);
  }
  onMount(async () => {
    if (!canvasEl) return;
    try {
      const mod = await import('chart.js/auto');
      ChartConstructor = mod.Chart;
      createChart(local.type);
      sharedDark.subscribe();
      skipNextUpdate = true;
      setChartReady(true);
    } catch (e) {
    }
  });
  createEffect(() => {
    if (!chartReady()) return;
    const currentDark = dark();
    const opts = local.options;
    const fill = local.fill;
    const type = local.type;
    const data = local.data;
    if (skipNextUpdate) {
      skipNextUpdate = false;
      return;
    }
    if (type !== untrack(currentType)) {
      createChart(type);
      return;
    }
    const ci = chartInstance;
    if (!ci) return;
    if (!data.datasets.length) {
      ci.data.labels = [];
      ci.data.datasets = [];
      ci.update("none");
      return;
    }
    const config = buildConfig(type, data, currentDark, opts, fill, local.borderWidth);
    ci.options = config.options;
    ci.data.labels = data.labels;
    ci.data.datasets = data.datasets.map((ds, i) => {
      const prev = ci.data.datasets[i];
      return {
        ...prev ?? {},
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.backgroundColor,
        borderColor: ds.borderColor,
        hoverBackgroundColor: ds.hoverBackgroundColor,
        hoverBorderColor: ds.hoverBorderColor,
        fill: type === "line" ? fill ?? false : void 0
      };
    });
    if (type === "doughnut" || type === "pie") {
      applySegmentBorders(ci, type, currentDark);
    } else {
      ci.update();
    }
  });
  onCleanup(() => {
    sharedDark.unsubscribe();
    destroyChart();
  });
  const hasAccessibleName = () => !!local["aria-label"] || !!local["aria-labelledby"];
  return (() => {
    var _el$ = _tmpl$(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : canvasEl = _el$2;
    effect((_p$) => {
      var _v$ = cn("h-full w-full min-h-[200px]", local.class), _v$2 = hasAccessibleName() ? void 0 : "true", _v$3 = local["aria-label"], _v$4 = local["aria-labelledby"], _v$5 = hasAccessibleName() ? "img" : void 0, _v$6 = hasAccessibleName() ? 0 : void 0;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$, "aria-hidden", _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && setAttribute(_el$, "aria-labelledby", _p$.o = _v$4);
      _v$5 !== _p$.i && setAttribute(_el$, "role", _p$.i = _v$5);
      _v$6 !== _p$.n && setAttribute(_el$, "tabindex", _p$.n = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    });
    return _el$;
  })();
}
var _tmpl$2 = /* @__PURE__ */ template(`<div><canvas>`);
function resolveDefaultColor() {
  if (typeof window === "undefined") return "#3b82f6";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--color-primary-500").trim();
  return v || "#3b82f6";
}
function Sparkline(props) {
  const [local] = splitProps(props, ["data", "color", "fill", "tension", "showPoint", "min", "max", "aria-label", "aria-labelledby", "class"]);
  let canvasEl;
  let chartInstance = null;
  const [chartReady, setChartReady] = createSignal(false);
  const color = () => local.color ?? resolveDefaultColor();
  const fill = () => local.fill !== false;
  const fillColor = createMemo(() => `color-mix(in srgb, ${color()} 25%, transparent)`);
  let ChartCtor = null;
  let skipNextUpdate = false;
  onMount(async () => {
    if (!canvasEl) return;
    try {
      const {
        Chart: Chart2
      } = await import('chart.js/auto');
      ChartCtor = Chart2;
      const config = {
        type: "line",
        data: {
          labels: local.data.map((_, i) => i.toString()),
          datasets: [{
            data: local.data,
            borderColor: color(),
            backgroundColor: fill() ? fillColor() : void 0,
            fill: fill(),
            tension: local.tension ?? 0.3,
            borderWidth: 1.5,
            pointRadius: local.showPoint !== false ? 2.5 : 0,
            pointHoverRadius: 4,
            pointBackgroundColor: color(),
            pointBorderColor: color()
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false,
              grace: local.min == null && local.max == null ? "5%" : void 0,
              beginAtZero: false,
              min: local.min,
              max: local.max
            }
          },
          interaction: {
            intersect: false,
            mode: "index"
          }
        }
      };
      chartInstance = new ChartCtor(canvasEl, config);
      skipNextUpdate = true;
      setChartReady(true);
    } catch (e) {
    }
  });
  createEffect(() => {
    if (!chartReady()) return;
    const data = local.data;
    const c = color();
    const fillEnabled = fill();
    const fc = fillColor();
    const showPt = local.showPoint !== false ? 2.5 : 0;
    const tension = local.tension ?? 0.3;
    const yMin = local.min;
    const yMax = local.max;
    if (skipNextUpdate) {
      skipNextUpdate = false;
      return;
    }
    const ci = chartInstance;
    if (!ci) return;
    if (!data.length) {
      ci.data.labels = [];
      ci.data.datasets[0].data = [];
      ci.update("none");
      return;
    }
    const nextLen = data.length;
    if ((ci.data.labels?.length ?? 0) !== nextLen) {
      ci.data.labels = Array.from({
        length: nextLen
      }, (_, i) => String(i));
    }
    ci.data.datasets[0].data = data;
    ci.data.datasets[0].borderColor = c;
    ci.data.datasets[0].backgroundColor = fillEnabled ? fc : void 0;
    const ds = ci.data.datasets[0];
    ds.fill = fillEnabled;
    ds.pointRadius = showPt;
    ds.tension = tension;
    const yScale = ci.options.scales?.["y"];
    if (yScale) {
      yScale.min = yMin;
      yScale.max = yMax;
      yScale.grace = yMin == null && yMax == null ? "5%" : void 0;
    }
    ci.update("none");
  });
  onCleanup(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
  const hasAccessibleName = () => !!local["aria-label"] || !!local["aria-labelledby"];
  return (() => {
    var _el$ = _tmpl$2(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : canvasEl = _el$2;
    effect((_p$) => {
      var _v$ = cn("h-full w-full min-h-[32px]", local.class), _v$2 = hasAccessibleName() ? void 0 : "true", _v$3 = local["aria-label"], _v$4 = local["aria-labelledby"], _v$5 = hasAccessibleName() ? "img" : void 0;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$, "aria-hidden", _p$.t = _v$2);
      _v$3 !== _p$.a && setAttribute(_el$, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && setAttribute(_el$, "aria-labelledby", _p$.o = _v$4);
      _v$5 !== _p$.i && setAttribute(_el$, "role", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
}

export { Chart, Sparkline };
