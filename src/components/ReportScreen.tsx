@@ .. @@
   return (
-    <div>
+    <div className="min-h-screen bg-gray-900 py-20 px-4">
+      <div className="max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
-             <h2 className="text-3xl font-extrabold text-slate-800">Your Personalized Career Report</h2>
+             <h2 className="text-3xl font-extrabold text-white">Your Personalized Career Report</h2>
              <div className="flex gap-4">
-                <button onClick={onRetake} className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
+                <button onClick={onRetake} className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                     <RefreshCwIcon className="h-5 w-5 mr-2" /> Retake Test
                 </button>
-                <button onClick={downloadPdf} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
+                <button onClick={downloadPdf} className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                     <DownloadIcon className="h-5 w-5 mr-2" /> Download PDF
                 </button>
              </div>
         </div>
       
-      <div ref={reportRef} className="p-4 bg-slate-100 rounded-lg">
+      <div ref={reportRef} className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left Column - Chart */}
-            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
-                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Your Profile Overview</h3>
+            <div className="lg:col-span-1 bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600">
+                <h3 className="text-xl font-bold text-white mb-4 text-center">Your Profile Overview</h3>
                 <ScoreChart scores={normalizedScores} />
             </div>

             {/* Right Column - Strengths */}
             <div className="lg:col-span-2">
-                 <SectionCard icon={<LightbulbIcon className="h-8 w-8 text-yellow-500" />} title="Your Dominant Strengths">
+                 <SectionCard icon={<LightbulbIcon className="h-8 w-8 text-yellow-400" />} title="Your Dominant Strengths">
                     <ul className="space-y-4">
                         {report.strengths.map((strength, index) => (
-                            <li key={index} className="bg-yellow-50 p-4 rounded-lg">
-                                <p className="font-bold text-yellow-800">{strength.title}</p>
-                                <p className="text-slate-600">{strength.description}</p>
+                            <li key={index} className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/50">
+                                <p className="font-bold text-yellow-300">{strength.title}</p>
+                                <p className="text-gray-300">{strength.description}</p>
                             </li>
                         ))}
                     </ul>
@@ -67,13 +69,13 @@ export const ReportScreen: React.FC<ReportScreenProps> = ({ report, scores, onR
         </div>
         
         <div className="mt-6">
-             <SectionCard icon={<BriefcaseIcon className="h-8 w-8 text-indigo-500" />} title="Top 3 Career Matches">
+             <SectionCard icon={<BriefcaseIcon className="h-8 w-8 text-blue-400" />} title="Top 3 Career Matches">
                  <div className="grid md:grid-cols-3 gap-6">
                      {report.careerMatches.map((match, index) => (
-                        <div key={index} className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-400">
-                             <h4 className="font-bold text-lg text-indigo-800">{match.title}</h4>
-                             <p className="text-slate-700 mt-2 mb-4">{match.description}</p>
+                        <div key={index} className="bg-blue-900/30 p-5 rounded-lg border-l-4 border-blue-400">
+                             <h4 className="font-bold text-lg text-blue-300">{match.title}</h4>
+                             <p className="text-gray-300 mt-2 mb-4">{match.description}</p>
                              <div className="text-sm space-y-2">
-                                <p><span className="font-semibold text-slate-600">Trends:</span> {match.trends}</p>
-                                <p><span className="font-semibold text-slate-600">Education:</span> {match.education}</p>
+                                <p><span className="font-semibold text-gray-400">Trends:</span> <span className="text-gray-300">{match.trends}</span></p>
+                                <p><span className="font-semibold text-gray-400">Education:</span> <span className="text-gray-300">{match.education}</span></p>
                              </div>
                         </div>
@@ .. @@
         </div>

         <div className="mt-6">
-             <SectionCard icon={<GrowthIcon className="h-8 w-8 text-green-500" />} title="Custom Development Plan">
+             <SectionCard icon={<GrowthIcon className="h-8 w-8 text-green-400" />} title="Custom Development Plan">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
-                        <h4 className="font-semibold text-lg text-slate-700 flex items-center mb-3"><TargetIcon className="h-5 w-5 text-red-500 mr-2"/>Areas for Improvement</h4>
+                        <h4 className="font-semibold text-lg text-white flex items-center mb-3"><TargetIcon className="h-5 w-5 text-red-400 mr-2"/>Areas for Improvement</h4>
                         <ul className="space-y-3">
                             {report.developmentPlan.areasForImprovement.map((area, index) => (
-                                <li key={index} className="bg-red-50 p-3 rounded-lg">
-                                    <p className="font-bold text-red-800">{area.title}</p>
-                                    <p className="text-slate-600">{area.description}</p>
+                                <li key={index} className="bg-red-900/30 p-3 rounded-lg border border-red-700/50">
+                                    <p className="font-bold text-red-300">{area.title}</p>
+                                    <p className="text-gray-300">{area.description}</p>
                                 </li>
                             ))}
                         </ul>
                     </div>
                      <div>
-                        <h4 className="font-semibold text-lg text-slate-700 mb-3">Actionable Recommendations</h4>
+                        <h4 className="font-semibold text-lg text-white mb-3">Actionable Recommendations</h4>
                          <ul className="space-y-3">
                             {report.developmentPlan.recommendations.map((rec, index) => (
-                                <li key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
+                                <li key={index} className="flex items-start bg-green-900/30 p-3 rounded-lg border border-green-700/50">
                                     <RecommendationIcon type={rec.type} />
                                     <div>
-                                        <p className="font-bold text-green-800">{rec.type}</p>
-                                        <p className="text-slate-600">{rec.description}</p>
+                                        <p className="font-bold text-green-300">{rec.type}</p>
+                                        <p className="text-gray-300">{rec.description}</p>
                                     </div>
                                 </li>
                             ))}
@@ -99,6 +101,8 @@ export const ReportScreen: React.FC<ReportScreenProps> = ({ report, scores, onR
             </SectionCard>
         </div>
       </div>
+      </div>
     </div>
   );
 };