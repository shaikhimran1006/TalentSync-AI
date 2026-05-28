"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fitDistribution, heatmapData, skillDemand } from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="section-title">Hiring Intelligence Analytics</h2>
        <p className="subtle-text">Live signals across role fit, skills, and growth indicators.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDemand}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="skill" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }} />
                <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fit Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fitDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} fill="#38bdf8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Behavioral Signal Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={heatmapData}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="category" stroke="#94a3b8" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} stroke="#1f2937" />
              <Radar name="Signal" dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
