const options = {
	backgroundColor: '#fff',
	legend: {
		show: true,
		bottom: 20,
		padding: 5,
		itemGap: 5,
		// formatter: name => {
		// 	let obj = data.series.data.find(item => item.name == name)
		// 	return name + ' ' + obj.value
		// },
		borderRadius: [5, 5, 5, 5],
		borderWidth: 1,
		borderColor: '#ccc',
		icon: 'circle',
		textStyle: {
			fontFamily: 'Courier New',
		},
	},
	tooltip: {
		show: true,
		position: ['10%', '50%'],
	},
	series: [
		{
			type: 'pie',
			radius: ['20%', '60%'],
			center: ['49.5%', '40%'],
			top: -20,
			label: {
				position: 'outside',
				minMargin: 0,
				formatter: `{c|{b}}{a|\n{d}%} \n {b|({c}次)}`,
				rich: {
					a: {
						lineHeight: 15,
						height: 22,
					},
					b: {
						height: 0,
						color: '#AEAEB1',
						fontSize: 11,
					},
					c: {
						lineHeight: 15,
						height: 22,
						color: '#434343',
						fontWeight: 'bold',
						fontSize: 14,
					},
				},
			},
			labelLine: {
				length: 20,
				length2: 5,
			},
			emphasis: {
				label: {
					show: true,
					fontWeight: 'bold',
					formatter: `{c|{b}}{a|\n{d}%} \n {b|({c}次)}`,
					rich: {
						a: {
							lineHeight: 15,
							height: 22,
							color: 'inherit',
							fontSize: '15',
						},
						b: {
							height: 0,
							color: 'inherit',
							fontSize: '13',
						},
						c: {
							lineHeight: 15,
							height: 22,
							color: 'inherit',
							fontWeight: 'bold',
							fontSize: 16,
						},
					},
				},
			},
			// data: data.series.data
		},
	],
}

export function usePie() {
	function getOptions() {
		return _cloneDeep(options)
	}
	return { getOptions }
}
