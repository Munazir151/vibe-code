type ReportCallback = (metric: {
  name: string;
  value: number;
  delta?: number;
}) => void;

// Simple mock implementation to avoid dependency errors
const reportWebVitals = (onPerfEntry?: ReportCallback) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // In a real implementation, web-vitals would be used here
    console.log('Web Vitals reporting is disabled');
  }
};

export default reportWebVitals;
