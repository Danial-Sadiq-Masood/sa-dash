import { useEffect, useMemo, useRef, useState } from 'react'
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

import DistrictDataTable from './DataTable/DataTable';

import AssessmentDataTable from './DataTable/AssessmentDataTable';

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

  const [filters, setFilters] = useState({
    dsp: [],
    province: [],
    district: [],
    subDistrict: [],
  });

  const previousFilters = useRef(filters);

  useEffect(() => {
    previousFilters.current = filters;
  }, [filters])

  const filtersChanged = JSON.stringify(previousFilters.current) !== JSON.stringify(filters);

  const updateFilters = (key, val) => {
    setFilters({
      ...filters,
      [key]: val
    });
  };

  const filterQueries = [
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetProvinceFacilityData',
      params: [],
      key: 'comboBoxQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetPartCScoreData',
      params: [],
      key: 'radialChartQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/ChartGaugeFacilitiesCompleted_aND8ZzKsyrprAQy84oi8z3',
      params: [],
      key: 'gaugeChartQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/ChartDistrictLevels_aND8ZzKsyrprAQy84oi8z3',
      params: [],
      key: 'districtTableQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/ChartDistrictFacilitiesCompleted_aND8ZzKsyrprAQy84oi8z3',
      params: [],
      key: 'assessmentTableQ'
    },
  ];

  filterQueries.forEach(d => {
    d.params = [
      {
        key: 'dsp',
        val: filters.dsp
      },
      {
        key: 'province',
        val: filters.province
      },
      {
        key: 'districts',
        val: filters.district
      },
      {
        key: 'subdistricts',
        val: filters.subDistrict
      },
    ]
  })

  const dropDownQueries = [
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetFilterData',
      params: [
        {
          key: 'viewName',
          val: 'dsp'
        }
      ],
      key: 'populateSelectQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetFilterData',
      params: [
        {
          key: 'viewName',
          val: 'provinces'
        }
      ],
      key: 'populateSelectQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetFilterData',
      params: [
        {
          key: 'viewName',
          val: 'districts'
        }
      ],
      key: 'populateSelectQ'
    },
    {
      url: 'https://clisupport.co.za/Chart_aND8ZzKsyrprAQy84oi8z3/GetFilterData',
      params: [
        {
          key: 'viewName',
          val: 'subdistricts'
        }
      ],
      key: 'populateSelectQ'
    }
  ];

  const queries = [
    ...filterQueries,
    ...dropDownQueries
  ]

  const dataQueries = useQueries(
    queries.map(d => {
      const queryParams = d.params || [];
      return {
        queryKey: [d.key, ...queryParams],
        queryFn: () => {
          const params = queryParams.reduce(
            (acc, d) => {
              acc[d.key] = Array.isArray(d.val) ? d.val[0] : d.val
              return acc;
            }
            , {})

          console.log(params, 'params')
          return axios.get(d.url, {
            params: params
          })
        },
        staleTime: 600000
      }
    })
  )

  window.queries = queries;

  console.log(dataQueries);

  const comboBoxQuery = dataQueries[0];

  const radialChartQuery = dataQueries[1];

  const gaugeChartQuery = dataQueries[2];

  const districtTableQuery = dataQueries[3];

  const assessmentTableQuery = dataQueries[4];

  const dspSelectQuery = dataQueries[5];

  const provincesSelectQuery = dataQueries[6];

  const districtsSelectQuery = dataQueries[7];

  const subDistrictsSelectQuery = dataQueries[8];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className='grid grid-cols-4 auto-rows-auto	gap-6'>
      <div className="col-start-1 col-span-4 h-fit flex flex-col gap-4 top-3 z-50">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-m font-medium">
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 auto-rows-auto gap-2">
                <MultiSelect
                  options={dspSelectQuery.data?.data?.data.map(d => ({ value: d.Name, label: d.Name }))}
                  label="Organisation"
                  setVal={(val) => updateFilters('dsp', val)}
                />
                <MultiSelect
                  options={provincesSelectQuery.data?.data?.data.map(d => ({ value: d.Name, label: d.Name }))}
                  label="Province"
                  setVal={(val) => updateFilters('province', val)}
                />
                <MultiSelect
                  options={districtsSelectQuery.data?.data?.data.map(d => ({ value: d.Name, label: d.Name }))}
                  label="District"
                  setVal={(val) => updateFilters('district', val)}
                />
                <MultiSelect
                  options={subDistrictsSelectQuery.data?.data?.data.map(d => ({ value: d.Name, label: d.Name }))}
                  label="Sub-District"
                  setVal={(val) => updateFilters('subDistrict', val)}
                />
                <MultiSelect
                  options={[1, 2, 3]}
                  label="Assesment Occurrence"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4 text-left col-start-1 col-span-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="table">
              Table
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 auto-rows-auto gap-4 items-start">
              <div className='col-start-1 col-span-1 flex flex-col gap-4'>
                <RadialChart
                  key={2}
                  setShowTooltip={setShowTooltip}
                  setTooltipData={setTooltipData}
                  loadingData={radialChartQuery.isFetching}
                  data={radialChartQuery.data?.data}
                  filtersChanged={filtersChanged}
                  status={radialChartQuery.status}
                  dataUpdatedAt={radialChartQuery.dataUpdatedAt}
                />
                <GaugeChart
                  loadingData={gaugeChartQuery.isFetching}
                  data={gaugeChartQuery.data?.data}
                />
              </div>
              <Card className="col-start-2 col-span-2">
                <CardHeader className="bg-[#f7fbff]">
                  <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
                  <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssessmentDataTable
                    data={assessmentTableQuery.data?.data?.data}
                    loadedTable={!assessmentTableQuery.isFetching}
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <Tooltip showTooltip={showTooltip} toolTipData={toolTipData} />
              <BarLineChart
                key={1}
                setShowTooltip={setShowTooltip}
                setTooltipData={setTooltipData}
                loadingData={comboBoxQuery.isFetching}
                data={comboBoxQuery.data?.data}
                filtersChanged={filtersChanged}
                status={comboBoxQuery.status}
                dataUpdatedAt={comboBoxQuery.dataUpdatedAt}
              />
            </div>
            <Card className="">
              <CardHeader className="bg-[#f7fbff]">
                <CardTitle className="text-left text-lg">Public Health Facilities</CardTitle>
                <CardDescription className="text-left">SPI-RT Assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <DistrictDataTable
                  data={districtTableQuery.data?.data?.data}
                  loadedTable={!districtTableQuery.isFetching}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="table">
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MultiSelect({ options, label, setVal }) {

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
        options={options}
        isMulti
        onChange={(val) => {
          console.log(val, 'selVal');
          setVal(val.map(d => d.value));
        }}
      />
    </div>
  );
}


export default App
