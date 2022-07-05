Chart.register(ChartDataLabels);

styleUpdate = function(e) {
	e.style.backgroundColor = 'rgba(255,255,255,0.9)';
	canvas.style.backgroundColor = 'rgba(0,0,0,0.5)';
	e.style.margin = '50px 0 0 20px';
	canvas.style.display = "flex";
}

//var UI = {};

//UT.AJAX = function() {

//	var __THIS = {};
// Chart 생성

//	__THIS.get = function createChart(canvasNm, dataArr, labelArr, chartType) {
function createChart(canvasNm, dataArr, labelArr, chartType) {

	//__THIS.ctx = document.getElementById(canvasNm).getContext('2d');
	const ctx = document.getElementById(canvasNm).getContext('2d');

	// 차트 세팅값 정의
	let chart = new Chart(ctx, {
		type: chartType,
		data: {
			// 차트 상단에 범례
			labels: labelArr,
			datasets: [
				{
					label: '체력',
					data: [1623, 1932, 3694, 10453, 14280, 8691, 7832, 4987],
					borderColor: [
						'rgba(231,127,103,1)'],
					cubicInterpolationMode: 'monotone',
					borderWidth: 2,
					pointStyle: 'circle',
					pointRadius: 5,
					pointBorderColor: 'rgba(231,127,103,1)',
					pointBackgroundColor: 'white',
					//type: 'bar'
				},
				{
					label: '파워',
					data: [6123, 19232, 36934, 28453, 105270, 86911, 78232, 49837],
					borderColor: [
						'rgba(244,175,143,1)'],
					// borderDash: [2, 2],
					fill: false,
					pointStyle: 'circle',
					pointRadius: 5,
					cubicInterpolationMode: 'monotone',
					pointBorderColor: 'rgba(244,175,143,1)',
					pointBackgroundColor: 'white',
					//stack: 'combined'
				},
				{
					label: '공격력',
					data: [113, 19222, 3693, 10437, 45288, 8691, 7882, 4983],
					borderColor: [
						'rgba(247,216,150,1)'],
					fill: false,
					pointStyle: 'circle',
					pointRadius: 5,
					cubicInterpolationMode: 'monotone',
					tension: 0.4,
					pointBorderColor: 'rgba(247,216,150,1)',
					pointBackgroundColor: 'white',
					//stack: 'combined'
				},
				{
					label: '방어력',
					data: [113, 2134, 43, 6545, 23432, 4545, 12345, 654],
					borderColor: [
						'rgba(132,150,237,1)'],
					fill: false,
					pointStyle: 'circle',
					pointRadius: 5,
					cubicInterpolationMode: 'monotone',
					tension: 0.4,
					pointBorderColor: 'rgba(132,150,237,1)',
					pointBackgroundColor: 'white',
					//stack: 'combined'
				}
			]
		},
		options: {
			//			 2중 막대
			elements: {
				line: {
					borderWidth: 2,
				}
			},
			responsive: true,
			scales: {
				x: {
					title: {
						display: true,
					},
					ticks: {
						color: 'black',
						font: {
							weight: "bold"
						},
					},
					grid: {
						// display:false하면 척도를 그릴 수 없으므로 투명도를 높여 그리드 처리
						color: 'rgba(0,0,0,0)',
						tickColor: "black",
						tickWidth: 1,
						borderColor: 'black'
					}
				},
				y: {
					min: 0,
					// max: 150000
					// 가장 큰 데이터에서 10000 크게
					suggestedMax: 10000,
					ticks: {
						color: 'black',
						font: {
							weight: "bold"
						},
						// forces step size to be 50 units
						stepSize: 50000
					},
					grid: {
						color: 'rgba(0,0,0,0)',
						tickColor: "black",
						tickWidth: 1,
						borderColor: 'black'
					}
				},
			},
			plugins: {
				// 데이터 옵션 설정 _참고 https://chartjs-plugin-datalabels.netlify.app/guide/options.html
				datalabels: {
					anchor: 'end',
					color: 'black',
					labels: {
						title: {
							font: {
								weight: 'bold'
							}
						},
					},
					// 선 위로 올려
					align: 'top'
				},
				title: {
					display: true,
					text: '월별 구매건수',
					color: 'black',
					font: {
						weight: 'bold',
						size: 20
					}
				}, legend: {
					display: true,
					position: 'top',
					labels: {
						boxHeight: 2,
						boxWidth: 50,
						//	useLineStyle: true,
						//	usePointStyle: true
					}
				},
				tooltip: {
					enabled: false,
					// html 편집 handler 호출
					external: externalTooltipHandler
				}
				//				LEGEND: {
				//					DISPLAY: TRUE,
				//					POSITION: 'TOP'
				//				}
			},
		}
	});
}

/* DATA HOVER HTML 편집 */
var getOrCreateTooltip = function getOrCreateTooltip(chart) {
	var tooltipEl = chart.canvas.parentNode.querySelector('div');
	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
		tooltipEl.style.borderRadius = '3px';
		tooltipEl.style.color = 'white';
		tooltipEl.style.opacity = 1;
		tooltipEl.style.pointerEvents = 'none';
		tooltipEl.style.position = 'absolute';
		tooltipEl.style.transform = 'translate(-50%, 0)';
		tooltipEl.style.transition = 'all .1s ease';

		var table = document.createElement('table');
		table.style.margin = '0px';

		tooltipEl.appendChild(table);
		chart.canvas.parentNode.appendChild(tooltipEl);
	}
	return tooltipEl;
};

var externalTooltipHandler = function externalTooltipHandler(context) {

	// Tooltip Element
	var chart = context.chart;
	var tooltip = context.tooltip;

	var tooltipEl = getOrCreateTooltip(chart);
	// Hide if no tooltip
	if (tooltip.opacity === 0) {
		tooltipEl.style.opacity = 0;
		return;
	}

	// Set Text
	if (tooltip.body) {
		(function() {
			var titleLines = tooltip.title || [];
			var bodyLines = tooltip.body.map(function(b) {
				return b.lines;
			});

			var tableHead = document.createElement('thead');

			titleLines.forEach(function(title) {
				var tr = document.createElement('tr');
				tr.style.borderWidth = 0;

				var th = document.createElement('th');
				th.style.borderWidth = 0;
				var text = document.createTextNode(title);

				th.appendChild(text);
				tr.appendChild(th);
				tableHead.appendChild(tr);
			});

			var tableBody = document.createElement('tbody');
			bodyLines.forEach(function(body, i) {
				var colors = tooltip.labelColors[i];
				var span = document.createElement('span');
				// type이 line이면 borderColor로 변경
				span.style.background = colors.borderColor;
				span.style.borderColor = colors.borderColor;
				span.style.borderWidth = '2px';
				span.style.marginRight = '10px';
				span.style.height = '5px';
				span.style.width = '20px';
				span.style.display = 'inline-block';

				var tr = document.createElement('tr');
				tr.style.backgroundColor = 'inherit';
				tr.style.borderWidth = 0;

				var td = document.createElement('td');
				td.style.borderWidth = 0;

				var text = document.createTextNode(body);

				td.appendChild(span);
				td.appendChild(text);
				tr.appendChild(td);
				tableBody.appendChild(tr);
			});

			var tableRoot = tooltipEl.querySelector('table');

			// Remove old children
			while (tableRoot.firstChild) {
				tableRoot.firstChild.remove();
			}

			// Add new children
			tableRoot.appendChild(tableHead);
			tableRoot.appendChild(tableBody);
		})();
	}

	var _chart$canvas = chart.canvas;
	var positionX = _chart$canvas.offsetLeft;
	var positionY = _chart$canvas.offsetTop;

	// Display, position, and set styles for font

	tooltipEl.style.opacity = 1;
	tooltipEl.style.left = positionX + tooltip.caretX + 'px';
	tooltipEl.style.top = positionY + tooltip.caretY + 'px';
	tooltipEl.style.font = tooltip.options.bodyFont.string;
	tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
		/* 팝업 html 변경 코드 끝 */