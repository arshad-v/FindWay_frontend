@@ .. @@
   return (
-    <div className="flex flex-col items-center justify-center text-center p-8">
-      <div className="bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto">
-        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
-        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">
+    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-8">
+      <div className="bg-gray-800 p-12 rounded-2xl shadow-2xl max-w-lg mx-auto border border-gray-700">
+        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
+        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
             {message ? "Please Wait" : "Generating Your Report"}
         </h2>
-        <p className="text-slate-600 transition-opacity duration-500">
+        <p className="text-gray-300 transition-opacity duration-500">
             {message || loadingMessages[messageIndex]}
         </p>
       </div>