const options = {
	backgroundColor: '#fff',
	grid: {
		top: 30,
		left: 55,
		bottom: 40,
		right: 20,
	},
	tooltip: {
		show: true,
	},
	xAxis: {
		type: 'category',
		data: null,
		nameLocation: 'start',
		name: '类型',
		offset: 10,
		nameTextStyle: {
			color: '#555',
			padding: [18, -10, 0, 0],
			height: 100,
			verticalAlign: 'top',
		},
		axisTick: {
			show: false,
		},
		axisLine: {
			lineStyle: {
				color: '#ccc',
			},
		},
		axisLabel: {
			color: '#555',
		},
		splitArea: {
			interval: 1,
		},
	},
	yAxis: {
		type: 'value',
		name: '(次)',
		nameTextStyle: {
			fontSize: 16,
			verticalAlign: 'bottom',
			color: '#333',
			padding: [0, 0, -5, -30],
		},
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
	},
	dataZoom: [
		{
			type: 'inside',
			start: 0,
			end: 50,
			xAxisIndex: [0],
		},
	],
	series: [
		{
			data: null,
			type: 'bar',
			barMaxWidth: 30,
		},
	],
}

export function useBar() {
	function getOptions(charts) {
		const result = _cloneDeep(options)
		if (charts) {
			result.series[0].itemStyle = {
				color: new charts.graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: '#FEC4C4' },
					{ offset: 1, color: '#FF4F4F' },
				]),
			}
		}
		return result
	}

	return { getOptions }
}
