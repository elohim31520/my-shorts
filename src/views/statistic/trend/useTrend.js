const options = {
	title: {
		left: 'center',
		top: 10,
		text: null,
		textStyle: {
			color: null,
			fontSize: 16,
			fontWeight: 'normal',
		},
		subtext: '（所选期数范围国内出现的次数）',
		subtextStyle: {
			color: '#656565',
		},
	},
	backgroundColor: '#fff',
	grid: {
		top: 80,
		left: 40,
		bottom: 40,
		right: 20,
	},
	tooltip: {
		show: true,
	},
	xAxis: {
		type: 'category',
		data: null, //data.xAxisData,
		nameLocation: 'start',
		name: '号码',
		offset: 10,
		nameTextStyle: {
			color: '#333',
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
			color: '#333',
		},
		splitArea: {
			interval: 1,
		},
	},
	yAxis: {
		type: 'value',
		name: '(次)',
		nameTextStyle: {
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
			data: null, //data.seriesData,
			type: 'line',
			symbol: 'circle',
			symbolSize: 10,
			label: {
				show: true,
			},
			lineStyle: {
				color: null,
			},
			itemStyle: {
				color: null,
			},
			label: {
				show: true,
				color: null,
			},
		},
	],
}

export function useTrend() {
	function getOptions({ color, title }) {
		const _options = _cloneDeep(options)
		_options.series[0].lineStyle.color = color
		_options.series[0].itemStyle.color = color
		_options.series[0].label.color = color
		_options.title.textStyle.color = color
		_options.title.text = title
		return _options
	}

	return { getOptions }
}
