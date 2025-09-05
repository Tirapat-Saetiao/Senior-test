import React from 'react';
import UnifiedDashboard from './UnifiedDashboard';

// This component now acts as a simple wrapper for the UnifiedDashboard
// This maintains backward compatibility while using the new architecture
const Test = () => {
  return <UnifiedDashboard />;
};

export default Test;
