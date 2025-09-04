@@ .. @@
  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <h2 className="text-3xl font-extrabold text-white">Your Personalized Career Report</h2>
             <div className="flex gap-4">
                <button onClick={onRetake} className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                    <RefreshCwIcon className="h-5 w-5 mr-2" /> Retake Test
                </button>
                <button onClick={downloadPdf} className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    <DownloadIcon className="h-5 w-5 mr-2" /> Download PDF
                </button>
             </div>
        </div>
      
      <div ref={reportRef} className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart */}
            <div className="lg:col-span-1 bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Your Profile Overview</h3>
                <ScoreChart scores={normalizedScores} />
            </div>

            {/* Right Column - Strengths */}
            <div className="lg:col-span-2">
                 <SectionCard icon={<LightbulbIcon className="h-8 w-8 text-yellow-400" />} title="Your Dominant Strengths">
                    <ul className="space-y-4">
                        {report.strengths.map((strength, index) => (
                            <li key={index} className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/50">
                                <p className="font-bold text-yellow-300">{strength.title}</p>
                                <p className="text-gray-300">{strength.description}</p>
                            </li>
                        ))}
                    </ul>
                 </SectionCard>
            </div>
        </div>
        
        <div className="mt-6">
             <SectionCard icon={<BriefcaseIcon className="h-8 w-8 text-blue-400" />} title="Top 3 Career Matches">
                 <div className="grid md:grid-cols-3 gap-6">
                     {report.careerMatches.map((match, index) => (
                        <div key={index} className="bg-blue-900/30 p-5 rounded-lg border-l-4 border-blue-400">
                             <h4 className="font-bold text-lg text-blue-300">{match.title}</h4>
                             <p className="text-gray-300 mt-2 mb-4">{match.description}</p>
                             <div className="text-sm space-y-2">
                                <p><span className="font-semibold text-gray-400">Trends:</span> <span className="text-gray-300">{match.trends}</span></p>
                                <p><span className="font-semibold text-gray-400">Education:</span> <span className="text-gray-300">{match.education}</span></p>
                             </div>
                        </div>
@@ .. @@
        </div>

        <div className="mt-6">
             <SectionCard icon={<GrowthIcon className="h-8 w-8 text-green-400" />} title="Custom Development Plan">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-lg text-white flex items-center mb-3"><TargetIcon className="h-5 w-5 text-red-400 mr-2"/>Areas for Improvement</h4>
                        <ul className="space-y-3">
                            {report.developmentPlan.areasForImprovement.map((area, index) => (
                                <li key={index} className="bg-red-900/30 p-3 rounded-lg border border-red-700/50">
                                    <p className="font-bold text-red-300">{area.title}</p>
                                    <p className="text-gray-300">{area.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-lg text-white mb-3">Actionable Recommendations</h4>
                         <ul className="space-y-3">
                            {report.developmentPlan.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start bg-green-900/30 p-3 rounded-lg border border-green-700/50">
                                    <RecommendationIcon type={rec.type} />
                                    <div>
                                        <p className="font-bold text-green-300">{rec.type}</p>
                                        <p className="text-gray-300">{rec.description}</p>
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
    </div>
  );
};

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-white ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

@@ .. @@
const RecommendationIcon: React.FC<{type: 'Habit' | 'Resource' | 'Exercise'}> = ({type}) => {
    switch (type) {
        case 'Habit': return <StarIcon className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0"/>;
        case 'Resource': return <BookOpenIcon className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0"/>;
        case 'Exercise': return <ZapIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0"/>;
        default: return null;
    }
}