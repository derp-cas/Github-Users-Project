// STEP 1 - Include Dependencies
// Include react
import React from 'react'

// Include the react-fusioncharts component
import ReactFC from 'react-fusioncharts'

// Include the fusioncharts library
import FusionCharts from 'fusioncharts'

// Include the chart type
import Chart from 'fusioncharts/fusioncharts.charts'

// Include the theme as fusion
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.candy'

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme)

const ChartComponent = ({ data }) => {
    // STEP 3 - Creating the JSON object to store the chart configurations
    const chartConfigs = {
        type: 'doughnut2d', // The chart type
        width: '100%', // Width of the chart
        height: '400', // Height of the chart
        dataFormat: 'json', // Data type
        dataSource: {
            // Chart Configuration
            chart: {
                paletteColors: '#6d3400,#dac694,#8c1313,#274f29,#ded2c0',
                doughnutRadius: '45%',
                decimals: 0,
                animation: true,
                showPercentValues: 0,
                //Set the chart caption
                caption: 'Stars Per Language',
                //Set the theme for your chart
                theme: 'candy',
            },
            // Chart Data
            data,
        },
    }
    return <ReactFC {...chartConfigs} />
}

export default ChartComponent
