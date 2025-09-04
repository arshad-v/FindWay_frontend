import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Fix: Import `Scores` type from `../types` where it is defined, as it's not exported from `scoreCalculator`.
import { type ReportData, type RawScores as FullScores, type Scores } from '../types';
import { getNormalizedScoresForChart } from '../utils/scoreCalculator';
import { ScoreChart } from './ScoreChart';
// Fix: Remove `LinkIcon` import because it is not an exported member of './icons'.
import { LightbulbIcon, BriefcaseIcon, GrowthIcon, DownloadIcon, RefreshCwIcon, StarIcon, TargetIcon, BookOpenIcon, ZapIcon } from './icons';

interface ReportScreenProps {
  report: ReportData;
  scores: FullScores;
  onRetake: () => void;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const RecommendationIcon: React.FC<{type: 'Habit' | 'Resource' | 'Exercise'}> = ({type}) => {
    switch (type) {
        case 'Habit': return <StarIcon className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0"/>;
        case 'Resource': return <BookOpenIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0"/>;
        case 'Exercise': return <ZapIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"/>;
        default: return null;
    }
}


export const ReportScreen: React.FC<ReportScreenProps> = ({ report, scores, onRetake }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const normalizedScores = getNormalizedScoresForChart(scores);

  const downloadPdf = () => {
    if (reportRef.current) {
        html2canvas(reportRef.current, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            let position = 0;
            if (height > pdfHeight) {
                // If the content is taller than one page, it will be clipped.
                // A more complex solution would be needed for multi-page PDFs.
                 pdf.addImage(imgData, 'PNG', 0, position, width, height);
            } else {
                 pdf.addImage(imgData, 'PNG', 0, position, width, height);
            }

            pdf.save('FindWay.ai_Career_Report.pdf');
        });
    }
  };

  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <h2 className="text-3xl font-extrabold text-slate-800">Your Personalized Career Report</h2>
             <div className="flex gap-4">
                <button onClick={onRetake} className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                    <RefreshCwIcon className="h-5 w-5 mr-2" /> Retake Test
                </button>
                <button onClick={downloadPdf} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                    <DownloadIcon className="h-5 w-5 mr-2" /> Download PDF
                </button>
             </div>
        </div>
      
      <div ref={reportRef} className="p-4 bg-slate-100 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Your Profile Overview</h3>
                <ScoreChart scores={normalizedScores} />
            </div>

            {/* Right Column - Strengths */}
            <div className="lg:col-span-2">
                 <SectionCard icon={<LightbulbIcon className="h-8 w-8 text-yellow-500" />} title="Your Dominant Strengths">
                    <ul className="space-y-4">
                        {report.strengths.map((strength, index) => (
                            <li key={index} className="bg-yellow-50 p-4 rounded-lg">
                                <p className="font-bold text-yellow-800">{strength.title}</p>
                                <p className="text-slate-600">{strength.description}</p>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            </div>
        </div>
        
        <div className="mt-6">
             <SectionCard icon={<BriefcaseIcon className="h-8 w-8 text-indigo-500" />} title="Top 3 Career Matches">
                 <div className="grid md:grid-cols-3 gap-6">
                     {report.careerMatches.map((match, index) => (
                        <div key={index} className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-400">
                             <h4 className="font-bold text-lg text-indigo-800">{match.title}</h4>
                             <p className="text-slate-700 mt-2 mb-4">{match.description}</p>
                             <div className="text-sm space-y-2">
                                <p><span className="font-semibold text-slate-600">Trends:</span> {match.trends}</p>
                                <p><span className="font-semibold text-slate-600">Education:</span> {match.education}</p>
                             </div>
                        </div>
                     ))}
                 </div>
            </SectionCard>
        </div>

        <div className="mt-6">
             <SectionCard icon={<GrowthIcon className="h-8 w-8 text-green-500" />} title="Custom Development Plan">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-lg text-slate-700 flex items-center mb-3"><TargetIcon className="h-5 w-5 text-red-500 mr-2"/>Areas for Improvement</h4>
                        <ul className="space-y-3">
                            {report.developmentPlan.areasForImprovement.map((area, index) => (
                                <li key={index} className="bg-red-50 p-3 rounded-lg">
                                    <p className="font-bold text-red-800">{area.title}</p>
                                    <p className="text-slate-600">{area.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-lg text-slate-700 mb-3">Actionable Recommendations</h4>
                         <ul className="space-y-3">
                            {report.developmentPlan.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
                                    <RecommendationIcon type={rec.type} />
                                    <div>
                                        <p className="font-bold text-green-800">{rec.type}</p>
                                        <p className="text-slate-600">{rec.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                 </div>
            </SectionCard>
        </div>
      </div>
    </div>
  );
};