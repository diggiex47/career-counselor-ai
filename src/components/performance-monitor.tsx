"use client";

import { useEffect } from "react";

// Performance monitoring component for development
export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "measure") {
            console.log(`🚀 Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ["measure", "navigation"] });

      // Monitor memory usage (if available)
      if ("memory" in performance) {
        const memoryInfo = (performance as any).memory;
        console.log("🧠 Memory Usage:", {
          used: `${(memoryInfo.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(memoryInfo.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          limit: `${(memoryInfo.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        });
      }

      // Monitor long tasks
      if ("PerformanceObserver" in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`⚠️ Long Task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });

        try {
          longTaskObserver.observe({ entryTypes: ["longtask"] });
        } catch (e) {
          // longtask not supported in all browsers
        }
      }

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
}

// Hook for measuring component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`⏱️ ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      };
    }
  });
}