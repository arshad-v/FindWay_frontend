@@ .. @@
 import React, { useState, useCallback, useEffect } from 'react';
-import { WelcomeScreen } from './components/WelcomeScreen';
+import { HomePage } from './components/HomePage';
+import { Footer } from './components/Footer';
 import { PreTestScreen } from './components/PreTestScreen';
@@ .. @@
   const renderContent = () => {
     switch (appState) {
       case 'welcome':
-        return <WelcomeScreen onStartTest={handleStartTest} error={error} />;
+        return <HomePage onStartAssessment={handleStartTest} error={error} />;
       case 'pre-test':
@@ .. @@
         if (report && scores && userData) {
           return <ReportScreen report={report} scores={scores} onRetake={handleRetakeTest} />;
         }
         handleStartTest();
-        return <WelcomeScreen onStartTest={handleStartTest} error="There was an issue loading your report. Please start a new test." />;
+        return <HomePage onStartAssessment={handleStartTest} error="There was an issue loading your report. Please start a new test." />;
       default:
-        return <WelcomeScreen onStartTest={handleStartTest} />;
+        return <HomePage onStartAssessment={handleStartTest} />;
     }
   };

   return (
-    <div className="bg-slate-50 min-h-screen text-slate-800">
+    <div className="bg-gray-900 min-h-screen text-white">
       <Header />
-      <main className="container mx-auto px-4 py-8">
+      <main>
         {renderContent()}
       </main>
+      {appState === 'welcome' && <Footer />}
     </div>
   );
 };