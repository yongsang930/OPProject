// 차트가 그려질 캔버스
const bc = document.getElementById("barChart");
const lc = document.getElementById("lineChart");

// ajax 실행값이 담길 변수
let ajax1;
let ajax2;
let ajax3;

// 호출 여부를 판단하는 변수
let tf1;
let tf2;
let tf3;

var arr = {};

styleUpdate = function(e) {
	e.style.backgroundColor = 'rgba(255,255,255,0.9)';
	canvas.style.backgroundColor = 'rgba(0,0,0,0.5)';
	e.style.margin = '50px 0 0 20px';
	canvas.style.display = "flex";
}

// ※pie 차트
function pieClick(id) {
	const pc = document.getElementById(id);
	styleUpdate(pc);

	if (!tf1 && !ajax1) {

		//url에서 json값을 가져옴
		ajax1 = $.ajax({
			url: 'https://api.odcloud.kr/api/15052327/v1/uddi:fd05b45a-6be9-4422-87a4-badc1cc7ca2f_201903051359?page=1&perPage=10&serviceKey=kuN7K%2B7jp7gjaQkPw426aka7RGc7FIrxlKA58ewnL4sJ%2FZPRC7QwTl9EWPrRCL4ScxUSTirtxN5pJNEyyIQmvg%3D%3D',
			type: 'get',
			dataType: 'json',
			success: function(result) {
				// ageChartData는 string 타입이므로 배열형태로 다시 담아줌
				//const arr = result.data.ageChartData.split(",");

				result.data.forEach(function(a, b, element) {
					arr.data = element;

					arr.data.name = element.행정기관;
					arr.data.ratio = element.성비;
				})

				console.log(arr);
				const data = {
					// 차트 상단에 범례
					labels: [
						'중곡제1동',
						'중곡제2동',
						'중곡제3동',
						'중곡제4동',
						'능동',
						'구의제1동',
						'구의제2동',
						'구의제3동',
						'광장동',
					],
					datasets: [{
						// 나타낼 데이터
						// data: [arr[0], arr[1], arr[2], arr[3], arr[4]],
						data: [
							arr.data[0].성비, arr.data[1].성비, arr.data[2].성비, arr.data[3].성비, arr.data[4].성비, arr.data[5].성비, arr.data[6].성비, arr.data[7].성비, arr.data[8].성비, arr.data[9].성비
						],

						// 데이터별 색
						backgroundColor: [
							'rgb(113, 139, 174)',
							'rgb(255, 202, 100)',
							'rgb(238, 142, 148)',
							'rgb(185, 190, 196)',
							'rgb(67, 78, 106)',
							'rgb(202, 139, 174)',
							'rgb(100, 202, 100)',
							'rgb(196, 142, 148)',
							'rgb(174, 196, 196)',
							'rgb(67, 196, 106)'
						],

						// hover 이벤트
						hoverOffset: 8
					}]
				};

				// 차트 세팅값 정의
				const config = {
					type: 'doughnut',
					data: data,
					options: {
						responsive: false
					}
				};

				// 차트 생성
				var myChart = new Chart(pc, config);
				btnPie.innerText = "Pie Chart Close!"

				tf1 = true;
				console.log("pie1");
			}
		});
	}

	// 차트 감추기
	else if (ajax1 && tf1) {

		let btnPie = document.getElementById("pie");
		btnPie.innerText = "Pie Chart Open!"

		pc.style.display = 'none'

		tf1 = false;

		console.log("pie2");
	}

	// 차트 보이기
	else if (ajax1) {
		pc.style.display = 'inline';
		btnPie.innerText = "Pie Chart Close!"
		tf1 = true;
		console.log("pie display chk");
	}
};

// ※bar 차트
function barClick(id) {
	const bc = document.getElementById(id);
	styleUpdate(bc);

	if (!tf2 && !ajax2) {

		ajax2 = $.ajax({
			url: 'https://api.odcloud.kr/api/15052327/v1/uddi:fd05b45a-6be9-4422-87a4-badc1cc7ca2f_201903051359?page=1&perPage=10&serviceKey=kuN7K%2B7jp7gjaQkPw426aka7RGc7FIrxlKA58ewnL4sJ%2FZPRC7QwTl9EWPrRCL4ScxUSTirtxN5pJNEyyIQmvg%3D%3D',
			type: 'get',
			dataType: 'json',
			success: function(result) {

				result.data.forEach(function(a, b, element) {
					arr.data = element;

					arr.data.name = element.행정기관;
					arr.data.ratio = element.성비;
				})

				const data = {
					labels: [
						'중곡제1동',
						'중곡제2동',
						'중곡제3동',
						'중곡제4동',
						'능동',
						'구의제1동',
						'구의제2동',
						'구의제3동',
						'광장동',
					],
					datasets: [{
						label: 'label',
						data: [arr.data[0].성비, arr.data[1].성비, arr.data[2].성비, arr.data[3].성비, arr.data[4].성비, arr.data[5].성비, arr.data[6].성비, arr.data[7].성비, arr.data[8].성비, arr.data[9].성비],
						backgroundColor: [
							'rgb(113, 139, 174)',
							'rgb(255, 202, 100)',
							'rgb(238, 142, 148)',
							'rgb(185, 190, 196)',
							'rgb(67, 78, 106)',
							'rgb(202, 139, 174)',
							'rgb(100, 202, 100)',
							'rgb(196, 142, 148)',
							'rgb(174, 196, 196)',
							'rgb(67, 196, 106)'
						],
						hoverOffset: 8
					}]
				}

				const config = {
					type: 'bar',
					data: data,
					options: {
						responsive: false
					}
				};

				var myChart = new Chart(bc, config);
				btnBar.innerText = "Bar Chart Close!"

				tf2 = true;
				console.log("bar1");
			}
		});
	}
	else if (ajax2 && tf2) {
		btnBar.innerText = "Bar Chart Open!"

		bc.style.display = 'none'
		tf2 = false;
		console.log("bar2");
	}

	else if (ajax2) {
		bc.style.display = 'inline';
		btnBar.innerText = "Bar Chart Close!"
		tf2 = true;
		console.log("bar display chk");
	}
};

// ※line 차트
function lineClick(id) {
	const lc = document.getElementById(id);
	styleUpdate(lc);

	if (!tf3 && !ajax3) {

		ajax3 = $.ajax({
			url: 'https://api.odcloud.kr/api/15052327/v1/uddi:fd05b45a-6be9-4422-87a4-badc1cc7ca2f_201903051359?page=1&perPage=10&serviceKey=kuN7K%2B7jp7gjaQkPw426aka7RGc7FIrxlKA58ewnL4sJ%2FZPRC7QwTl9EWPrRCL4ScxUSTirtxN5pJNEyyIQmvg%3D%3D',
			type: 'get',
			dataType: 'json',
			success: function(result) {

				result.data.forEach(function(a, b, element) {
					arr.data = element;

					arr.data.name = element.행정기관;
					arr.data.ratio = element.성비;
				})

				let speedData = {
					labels: [
						'중곡제1동',
						'중곡제2동',
						'중곡제3동',
						'중곡제4동',
						'능동',
						'구의제1동',
						'구의제2동',
						'구의제3동',
						'광장동',
					],
					datasets: [{
						label: '성비',
						data: [arr.data[0].성비, arr.data[1].성비, arr.data[2].성비, arr.data[3].성비, arr.data[4].성비, arr.data[5].성비, arr.data[6].성비, arr.data[7].성비, arr.data[8].성비, arr.data[9].성비],
						tension: 0.4,
						fill: false,
						borderColor: '#33B5B5',
						backgroundColor: 'transparent',
						pointBorderColor: '#F73788',
						pointBackgroundColor: '#ffffff',
						pointStyle: 'circle',
						pointRadius: 10,
						pointHoverRadius: 15,
						pointBorderWidth: 4,
					}]
				};

				let myChart = new Chart(lc, {
					type: 'line',
					data: speedData,
					options: {
						responsive: false
					}
				});

				btnLine.innerText = "Line Chart Close!"
				tf3 = true;
				console.log("line1");
			}
		});
	}
	else if (ajax3 && tf3) {
		btnLine.innerText = "Line Chart Open!"
		lc.style.display = 'none'
		tf3 = false;
		console.log("line2");
	}

	else if (ajax3) {
		lc.style.display = 'inline';
		btnLine.innerText = "Line Chart Close!"
		tf3 = true;
		console.log("line display chk");
	}
};

