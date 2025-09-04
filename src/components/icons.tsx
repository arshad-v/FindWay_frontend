@@ .. @@
     <line x1="12" y1="17" x2="12.01" y2="17" />
   </svg>
 );
+
+export const ShieldIcon: React.FC<IconProps> = (props) => (
+  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
+    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
+  </svg>
+);
+
+export const ClockIcon: React.FC<IconProps> = (props) => (
+  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
+    <circle cx="12" cy="12" r="10" />
+    <polyline points="12 6 12 12 16 14" />
+  </svg>
+);
+
+export const MenuIcon: React.FC<IconProps> = (props) => (
+  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
+    <line x1="3" y1="6" x2="21" y2="6" />
+    <line x1="3" y1="12" x2="21" y2="12" />
+    <line x1="3" y1="18" x2="21" y2="18" />
+  </svg>
+);