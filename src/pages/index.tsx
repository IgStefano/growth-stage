import { ReactECharts, ReactEChartsProps } from "@/components/echarts";
import type { GetStaticProps } from "next";

export default function Home({ climateData }: { climateData: ClimateData[] }) {
  const option: ReactEChartsProps["option"] = {
    title: { name: "Crescimento ao longo do tempo" },
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ReactECharts option={option} />
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
