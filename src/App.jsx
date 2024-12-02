import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tooltip from './tooltip'
import BarLineChart from './chartComponents/LineBarChart';
import RadialChart from './chartComponents/RadialChart';
import GaugeChart from './chartComponents/Gauge';


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useQueries, QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'

import Select from 'react-select';

import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

import DataTable from './DataTable/DataTable'


const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  )
}

function MainApp() {

  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipData, setTooltipData] = useState({ data: { rows: [] } });
  const [queries, setQueries] = useState([
    {
      url: 'http://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetProvinceFacilityData',
      params: [],
      key: 'comboBoxQ'
    },
    {
      url: 'http://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetPartCScoreData',
      params: [],
      key: 'radialChartQ'
    },
    {
      url: 'http://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/ChartGaugeFacilitiesCompleted_aND8ZzKsyrprAQy84oi8z3',
      params: [],
      key: 'gaugeChartQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/ChartDistrictLevels_aND8ZzKsyrprAQy84oi8z3',
      params: [],
      key: 'districtTableQ'
    }
  ]);

  const dataQueries = useQueries(
    queries.map(d => {
      const queryParams = d.params || [];
      return {
        queryKey: [d.key, ...queryParams],
        queryFn: () => axios.get(d.url)
      }
    })
  )

  window.setQueries = setQueries;

  console.log(dataQueries);

  const comboBoxQuery = dataQueries[0];

  const radialChartQuery = dataQueries[1];

  const gaugeChartQuery = dataQueries[2];

  const districtTableQuery = dataQueries[3];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className='grid grid-cols-5 auto-rows-auto	gap-4'>
        <Tabs defaultValue="overview" className="space-y-4 text-left col-start-1 col-span-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="table">
              Table
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="flex gap-4 items-start">
              <RadialChart
                key={2}
                setShowTooltip={setShowTooltip}
                setTooltipData={setTooltipData}
                loadingData={radialChartQuery.isLoading}
                data={radialChartQuery.data?.data}
              />
              <GaugeChart
                loadingData={gaugeChartQuery.isLoading}
                data={gaugeChartQuery.data?.data}
              />
            </div>
            <div>
              <Tooltip showTooltip={showTooltip} toolTipData={toolTipData} />
              <BarLineChart
                key={1}
                setShowTooltip={setShowTooltip}
                setTooltipData={setTooltipData}
                loadingData={comboBoxQuery.isLoading}
                data={comboBoxQuery.data?.data}
              />
            </div>
            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-m font-medium">
                  Table
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={districtTableQuery.data?.data?.data}
                  loadedTable={!districtTableQuery.isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="table">
          </TabsContent>
        </Tabs>
        <Card className="col-start-5 col-span-1 h-fit sticky top-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-m font-medium">
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-4'>
              <MultiSelect
                options={options}
                label="Organisation"
              />
              <MultiSelect
                options={options}
                label="Province"
              />
              <MultiSelect
                options={options}
                label="District"
              />
              <MultiSelect
                options={options}
                label="Sub-District"
              />
              <MultiSelect
                options={options}
                label="Assesment Occurrence"
              />
              <div className="flex flex-col gap-2">
                <Button>
                  <Filter />
                  Apply Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MultiSelect({ options, label }) {

  return (
    <div className="flex flex-col gap-2">
      <h3 className='text-sm text-left'>{label}</h3>
      <Select styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          textAlign: 'left'
        }),
        menu: (baseStyles, state) => ({
          ...baseStyles,
          textAlign: 'left'
        }),
      }}
        options={options} isMulti />
    </div>
  );
}


export default App
