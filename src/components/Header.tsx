@@ .. @@
 import React from 'react';
-import { CompassIcon } from './icons';
+import { CompassIcon, MenuIcon } from './icons';

 export const Header: React.FC = () => {
   return (
   )
 }
-    <header className="bg-white shadow-sm">
-      <div className="container mx-auto px-4 py-4 flex items-center">
-        <CompassIcon className="h-8 w-8 text-indigo-600" />
-        <h1 className="text-2xl font-bold text-slate-800 ml-2">FindWay.ai</h1>
+    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
+      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
+        <div className="flex items-center">
+          <CompassIcon className="h-8 w-8 text-blue-400" />
+          <h1 className="text-2xl font-bold text-white ml-2">FindWay.ai</h1>
+        </div>
+        
+        <nav className="hidden md:flex items-center space-x-8">
+          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">How It Works</a>
+          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
+          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">FAQ</a>
+          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Contact</a>
+        </nav>
+        
+        <button className="md:hidden text-gray-300 hover:text-white">
+          <MenuIcon className="h-6 w-6" />
+        </button>
       </div>
     </header>
   );
 };