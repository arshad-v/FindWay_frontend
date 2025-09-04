@@ .. @@
   return (
-    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
+    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-20 px-4">
+      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto border border-gray-700 w-full">
       <div className="mb-8">
         <div className="flex justify-between items-center mb-2">
-          <span className="text-sm font-medium text-slate-600">
+          <span className="text-sm font-medium text-gray-400">
             Question {currentQuestionIndex + 1} of {questions.length}
           </span>
-          <span className="text-sm font-bold text-indigo-600">{progress}%</span>
+          <span className="text-sm font-bold text-blue-400">{progress}%</span>
         </div>
-        <div className="w-full bg-slate-200 rounded-full h-2.5">
-          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
+        <div className="w-full bg-gray-700 rounded-full h-2.5">
+          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
         </div>
       </div>

       <div className="text-center min-h-[100px]">
-        <h3 className="text-2xl font-semibold text-slate-800">{currentQuestion.text}</h3>
+        <h3 className="text-2xl font-semibold text-white">{currentQuestion.text}</h3>
       </div>
       
       <div className="my-8 space-y-4">
@@ .. @@
             onClick={() => handleAnswerSelect(option.value)}
             className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] ${
               currentAnswerValue === option.value
-                ? 'bg-indigo-100 border-indigo-500 text-indigo-800 font-semibold'
-                : 'bg-white border-slate-300 hover:border-indigo-400'
+                ? 'bg-blue-900/50 border-blue-500 text-blue-300 font-semibold'
+                : 'bg-gray-700 border-gray-600 hover:border-blue-400 text-white'
             }`}
           >
             {option.text}
@@ .. @@
         <button
           onClick={handleBack}
           disabled={currentQuestionIndex === 0}
-          className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
+          className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
         >
           <ArrowLeftIcon className="h-5 w-5 mr-2" />
           Back
@@ .. @@
           <button
             onClick={() => onTestComplete(answers)}
             disabled={answers.length !== questions.length}
-            className="flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-md"
+            className="flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-md"
           >
             <CheckIcon className="h-5 w-5 mr-2" />
             Finish & See Report
@@ .. @@
           <button
             onClick={handleNext}
             disabled={!currentAnswerValue}
-            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
+            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
           >
             Next
             <ArrowRightIcon className="h-5 w-5 ml-2" />
           </button>
         )}
       </div>
+      </div>
     </div>
   );
 };