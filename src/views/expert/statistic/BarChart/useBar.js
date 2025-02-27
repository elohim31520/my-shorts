const options = {
	backgroundColor: '#fff',
	grid: {
		top: 30,
		left: 40,
		bottom: 30,
		right: 20,
	},
	tooltip: {
		show: true,
	},
	xAxis: {
		// type: 'category',
		data: null,
		nameLocation: 'start',
		// name: '类型',
		offset: 10,
		nameTextStyle: {
			color: '#656565',
			padding: [18, -10, 0, 0],
			height: 100,
			verticalAlign: 'top',
		},
		axisTick: {
			show: false,
		},
		axisLine: {
			color: '#f00',
			lineStyle: {
				color: '#ccc',
				type: 'dashed',
			},
		},
		axisLabel: {
			color: '#656565',
		},
		// splitArea: {
		// 	interval: 1,
		// },
	},
	yAxis: {
		type: 'value',
		nameTextStyle: {
			fontSize: 16,
			verticalAlign: 'bottom',
			color: '#656565',
			padding: [0, 0, -5, -30],
		},
		axisLine: {
			show: false,
			borderRadius: 15,
		},
		axisTick: {
			show: false,
		},
		splitLine: {
			lineStyle: {
				color: '#ccc',
			  	type: 'dashed'
			}
		}
	},
	// dataZoom: [
	// 	{
	// 		type: 'inside',
	// 		start: 0,
	// 		end: 50,
	// 		xAxisIndex: [0],
	// 	},
	// ],
	series: [
		{
			data: null,
			type: 'bar',
			barWidth: 35,
			label: {
				show: true,
				position: 'insideTop',
				color: '#fff',
				formatter: (params) => params.value + '人',
				fontSize: '12px',
			},
		},
	],
}

export function useBar() {
	function getOptions(charts) {
		const result = _cloneDeep(options)
		if (charts) {
			result.series[0].itemStyle = {
				color: new charts.graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: '#FEEAC6' },
					{ offset: 1, color: '#F3C280' },
				]),
			}
		}
		return result
	}

	return { getOptions }
}
