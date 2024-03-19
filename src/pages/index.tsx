import * as echarts from "echarts";
import { ReactECharts, ReactEChartsProps } from "@/components/echarts";
import {
  formatDate,
  formatPrecipitation,
  formatTemperature,
} from "@/utils/formatters";
import type { GetStaticProps } from "next";
import { useEffect, useRef } from "react";

export default function Home({ climateData }: { climateData: ClimateData[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  const precipitationData = climateData.map((data) => data.precipitation);
  const timeData = climateData.map((data) => formatDate(data.time));
  const temperatureData = climateData.map((data) => data.degree_days);
  const ndviData = climateData.map((data) => data.ndvi);

  const option: ReactEChartsProps["option"] = {
    title: {
      text: "Crescimento de indicadores ao longo do tempo",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const tooltip: string[] = [];
        params.forEach((param) => {
          let value = param.value;
          if (param.seriesName === "Accum Rainfall") {
            value = formatPrecipitation(param.value);
          }
          if (param.seriesName === "Degree Day") {
            value = formatTemperature(param.value);
          }

          tooltip.push(`<strong>${param.seriesName}</strong>: ${value}`);
        });
        return tooltip.join("<br>").toString();
      },
    },
    legend: {
      orient: "horizontal",
    },
    xAxis: [
      {
        data: timeData,
        axisLabel: {
          color: "#000",
        },
      },
    ],

    yAxis: [
      {
        name: "Accum Rainfall",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },

        axisLabel: {
          color: "#000",
          formatter: function (params: number) {
            return formatPrecipitation(params);
          },
        },
      },
      {
        name: "Degree Day",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        min: 0,
        max: 50,
        axisLabel: {
          color: "#000",
          formatter: function (params: number) {
            return formatTemperature(params);
          },
        },
      },
      {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        min: 0,
        max: 1,
      },
    ],
    series: [
      {
        name: "Accum Rainfall",
        type: "bar",
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#9dc6ed",
            },
            {
              offset: 1,
              color: "#08689f",
            },
          ]),
        },
        data: precipitationData,
      },
      {
        name: "Degree Day",
        type: "line",
        color: "#ff8335",
        showSymbol: false,
        silent: true,
        smooth: true,
        data: temperatureData,
        yAxisIndex: 1,
      },
      {
        name: "NVDI",
        type: "line",
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#70d798",
          },
          {
            offset: 1,
            color: "#e6f5ebFA",
          },
        ]),
        areaStyle: {
          opacity: 0.6,
        },
        data: ndviData,
        showSymbol: false,
        silent: true,
        smooth: true,
        lineStyle: {
          type: "dashed",
        },
        yAxisIndex: 2,
      },
    ],
    dataZoom: [
      {
        type: "inside",
      },
    ],
  };

  useEffect(() => {
    const zoomSize = 6;
    if (chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);
      chart?.on("click", function (params) {
        chart.dispatchAction({
          type: "dataZoom",
          startValue: timeData[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            timeData[
              Math.min(
                params.dataIndex + zoomSize / 2,
                precipitationData.length - 1
              )
            ],
        });
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ReactECharts option={option} chartRef={chartRef} />
    </main>
  );
}

type ClimateData = {
  degree_days: number;
  time: number;
  precipitation: number;
  ndvi: number;
};

export const getStaticProps = (async (context) => {
  const res = await fetch(
    "https://raw.githubusercontent.com/alexanderboliva/test/main/api_example.json"
  );
  const climateData = await res.json();
  return { props: { climateData } };
}) satisfies GetStaticProps<{
  climateData: ClimateData[];
}>;
