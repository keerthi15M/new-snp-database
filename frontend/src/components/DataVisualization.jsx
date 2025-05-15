import React, { useState } from 'react';
import { X, ChartPie, ChartBar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button_chart } from "./lib/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./lib/tabs";
import { DistributionPieChart } from './charts/DistributionPieChart';
import { DistributionBarChart } from './charts/DistributionBarChart';
import { ChartLegend } from './charts/ChartLegend';

const DataVisualization = ({ data, onClose }) => {
  const [activeView, setActiveView] = useState("bar"); // Default to bar chart
  const [activeItems, setActiveItems] = useState(Object.keys(data));

  const toggleItem = (item) => {
    if (activeItems.includes(item)) {
      if (activeItems.length > 1) { // Prevent deselecting all items
        setActiveItems(activeItems.filter(i => i !== item));
      }
    } else {
      setActiveItems([...activeItems, item]);
    }
  };

  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => activeItems.includes(key))
  );

  // Convert data for chart consumption
  const chartData = Object.entries(filteredData).map(([name, value]) => ({
    name,
    value: typeof value === 'string' ? parseFloat(value) || 1 : value,
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
            <h2 className="text-2xl font-semibold text-gray-800">Distribution Analysis</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-auto p-5 bg-gradient-to-br from-white/50 to-purple-50/50">
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <TabsList className="bg-white/50 backdrop-blur-sm border border-white/20">
                  <TabsTrigger value="pie" className="flex items-center gap-2 data-[state=active]:bg-purple-100/80">
                    <ChartPie className="h-4 w-4" />
                    <span>Pie Chart</span>
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="flex items-center gap-2 data-[state=active]:bg-purple-100/80">
                    <ChartBar className="h-4 w-4" />
                    <span>Bar Chart</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="text-sm text-muted-foreground bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                  {activeItems.length} of {Object.keys(data).length} items selected
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <TabsContent value="pie" className="mt-0">
                    <div className="h-[400px] flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                      <DistributionPieChart data={chartData} />
                    </div>
                  </TabsContent>
                  <TabsContent value="bar" className="mt-0">
                    <div className="h-[400px] flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                      <DistributionBarChart data={chartData} />
                    </div>
                  </TabsContent>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 h-full border border-white/20 shadow-lg">
                    <h3 className="font-medium mb-3 text-sm">Legend</h3>
                    <ChartLegend 
                      data={Object.keys(data)} 
                      activeItems={activeItems}
                      onToggle={toggleItem}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                <h3 className="font-medium mb-2">Key Insights</h3>
                <ul className="text-sm space-y-2">
                  {chartData.length > 0 && (
                    <>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>
                          {chartData.sort((a, b) => b.value - a.value)[0].name} has the highest value at {chartData.sort((a, b) => b.value - a.value)[0].value}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>
                          Total sum of all values: {chartData.reduce((sum, item) => sum + item.value, 0)}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>
                          Average value: {(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(2)}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </Tabs>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/10 p-4 flex justify-end bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
            <Button_chart variant="outline" onClick={onClose} className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">Close</Button_chart>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DataVisualization;
