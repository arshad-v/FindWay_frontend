
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { type Scores, type ChartData } from '../types';

interface ScoreChartProps {
    scores: Scores;
}

const mapScoresToChartData = (scores: Scores): ChartData[] => [
    { name: 'Orientation', score: scores.orientationStyle },
    { name: 'Interest', score: scores.interest },
    { name: 'Personality', score: scores.personality },
    { name: 'Aptitude', score: scores.aptitude },
    { name: 'EQ', score: scores.eq },
];

export const ScoreChart: React.FC<ScoreChartProps> = ({ scores }) => {
    const data = mapScoresToChartData(scores);
    
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Your Score" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
                    <Tooltip />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
