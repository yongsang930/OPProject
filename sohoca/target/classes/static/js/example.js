/**
 * 구글 차트 공통 소스
 */

//라인차트 canvasNm : 차트 그려질 영역, chartData : 데이터, labelArr : x축 기준, format:억원 or만원 or 원
function googleLineChart(canvasNm,chartData,labelArr,format,iconArr){	//canvasNm : 그래프 영역, chartData :데이터,labelArr:라벨, format:포멧 (억,만), iconArr: 변경을 워하는 아이콘 
	
    google.charts.setOnLoadCallback(drawChart);
    
	function drawChart() {
		var dataArr = [];					//차트 포맷에 맞는 배열
		var legend = '';	
		var dataRow = [];
		var chartArea ;
		var vAxis = '';		
		var colors = [];
		var dataZeroYn = 'N';
		if('salesChangeWeek' == canvasNm || 'salesChangeTime' == canvasNm){	//주변 매출 변화(요일별,시간대별)
			dataRow.push('division','value');
			dataArr.push(dataRow);
			for(var a=0; a<chartData.length; a++){
				dataRow = [];
				var money = "";
				if('억' == format){
					money = makeUckNumber(chartData[a])
				}else if('만' == format){
					money = makeManNumber(chartData[a])
				}else{
					cnt = chartData[a];
				}
				var value = parseFloat(money).toFixed(1);	//string으로 변환됨(소수점 자리수 포맷 후)
				
				dataRow.push(labelArr[a],parseFloat(value));
				dataArr.push(dataRow);
				dataZeroYn = 'Y';
			}
			format = format+"원";
			legend = 'none';
			chartArea = {left:50,width:'80%',height:'80%'};
			colors = ['#6f82fe','#5ac4e6'];
		}else if('deliveryTimeDay' == canvasNm || 'deliveryTimeWeek' == canvasNm || 'homeCardDeliveryChart' == canvasNm){	//배달 시간대 그래프 (시간대, 요일별) , 홈카드 (배달)
			dataRow.push('division','value');
			dataArr.push(dataRow);
			for(var a=0; a<chartData.length; a++){
				dataRow = [];
				var cnt = "";
				if('억' == format){
					cnt = makeUckNumber(chartData[a]);
				}else if('만' == format){
					cnt = makeManNumber(chartData[a]);
				}else{
					cnt = chartData[a];
				}
				var value = parseFloat(cnt).toFixed(1);	//string으로 변환됨(소수점 자리수 포맷 후)
				
				dataRow.push(labelArr[a],parseFloat(value));
				dataArr.push(dataRow);
				if(0 == chartData[a]){dataZeroYn = 'Y';}
			}
			legend = 'none';
			chartArea = {left:0,width:'100%',height:'80%'};
			colors = ['#6f82fe','#5ac4e6'];
		}else if('livingTime' == canvasNm || 'moveTime' == canvasNm){	//생활인구,유동인구 시간대별 차트
			dataRow.push('division','평일','휴일');
			dataArr.push(dataRow);
			
			for(var a=0; a<chartData[0].length; a++){
				dataRow = [];
				
				if('억' == format){
					chartData[0][a] = parseFloat(makeUckNumber(chartData[0][a])).toFixed(1);	//주말
					chartData[1][a] = parseFloat(makeUckNumber(chartData[1][a])).toFixed(1);	//평일
					chartData[2][a] = parseFloat(makeUckNumber(chartData[2][a])).toFixed(1);	//평균
				}else if('만' == format){
					chartData[0][a] = parseFloat(makeManNumber(chartData[0][a])).toFixed(1);	//주말
					chartData[1][a] = parseFloat(makeManNumber(chartData[1][a])).toFixed(1);	//평일
					chartData[2][a] = parseFloat(makeManNumber(chartData[2][a])).toFixed(1);	//평균
				}else{
					chartData[0][a] = parseFloat(chartData[0][a]).toFixed(0);	//주말
					chartData[1][a] = parseFloat(chartData[1][a]).toFixed(0);	//평일
					chartData[2][a] = parseFloat(chartData[2][a]).toFixed(0);	//평균
				}
				
				dataRow.push(labelArr[a],parseFloat(chartData[1][a]),parseFloat(chartData[0][a]));
				dataArr.push(dataRow);
				if(0 == chartData[0][a] || 0 == chartData[1][a] || 0 == chartData[2][a]){dataZeroYn = 'Y';}
			}
			format = format+"명";
			legend = {'position':'top','alignment':'center'};
			chartArea = {left:50, top:30, width:'80%',height:'70%'}; 
			colors = ['#6f82fe','#5ac4e6'];
		}else if('salesChangeMonth' == canvasNm ){	//주변매출변화(월별) (CCW이면 평균만 나옴)
			if(3 == chartData.length){
				dataRow.push('division','상위20%','평균','하위20%');
				dataArr.push(dataRow);
				for(var a=0; a<chartData[0].length; a++){
					dataRow = [];
					if('억' == format){
						chartData[0][a] = parseFloat(makeUckNumber(chartData[0][a])).toFixed(1);	//상위20%
						chartData[1][a] = parseFloat(makeUckNumber(chartData[1][a])).toFixed(1);	//평균
						chartData[2][a] = parseFloat(makeUckNumber(chartData[2][a])).toFixed(1);	//하위20%
					}else if('만' == format){
						chartData[0][a] = parseFloat(makeManNumber(chartData[0][a])).toFixed(1);	//상위20%
						chartData[1][a] = parseFloat(makeManNumber(chartData[1][a])).toFixed(1);	//평균
						chartData[2][a] = parseFloat(makeManNumber(chartData[2][a])).toFixed(1);	//하위20%
					}else{
						chartData[0][a] = parseFloat(chartData[0][a]).toFixed(1);	//상위20%
						chartData[1][a] = parseFloat(chartData[1][a]).toFixed(1);	//평균
						chartData[2][a] = parseFloat(chartData[2][a]).toFixed(1);	//하위20%
					}
					dataRow.push(labelArr[a],parseFloat(chartData[0][a]),parseFloat(chartData[1][a]),parseFloat(chartData[2][a]));
					dataArr.push(dataRow);
					//if(0 == chartData[0][a] || 0 == chartData[1][a] || 0 == chartData[2][a]){dataZeroYn = 'Y';}
					dataZeroYn = 'Y';
				}
				legend = {'position':'top','alignment':'center'};
			}else if(1 == chartData.length){
				dataRow.push('division','평균');
				dataArr.push(dataRow);
				for(var a=0; a<chartData[0].length; a++){
					dataRow = [];
					if('억' == format){
						chartData[0][a] = parseFloat(makeUckNumber(chartData[0][a])).toFixed(1);	//평균
					}else if('만' == format){
						chartData[0][a] = parseFloat(makeManNumber(chartData[0][a])).toFixed(1);	//평균
					}else{
						chartData[0][a] = parseFloat(chartData[0][a]).toFixed(1);	//평균
					}
					dataRow.push(labelArr[a],parseFloat(chartData[0][a]));
					dataArr.push(dataRow);
					//if(0 == chartData[0][a]){dataZeroYn = 'Y';}
					dataZeroYn = 'Y';
				}
				legend = 'none';
			}
			format = format+"원";
			chartArea = {left:50, top:30, width:'80%',height:'70%'}; 			
			colors = ['#6f82fe','#cbcbe8','#5ac4e6'];
		}else if('livingJob' == canvasNm){	//생활인구 학생/직장인 차트
			dataRow.push('division','학생','직장인');
			dataArr.push(dataRow);
			
			for(var a=0; a<chartData[0].length; a++){
				dataRow = [];
				if('억' == format){
					chartData[0][a] = parseFloat(makeUckNumber(chartData[0][a])).toFixed(1);	
					chartData[1][a] = parseFloat(makeUckNumber(chartData[1][a])).toFixed(1);	
				}else if('만' == format){
					chartData[0][a] = parseFloat(makeManNumber(chartData[0][a])).toFixed(1);	
					chartData[1][a] = parseFloat(makeManNumber(chartData[1][a])).toFixed(1);	
				}else{
					chartData[0][a] = parseFloat(chartData[0][a]).toFixed(0);	
					chartData[1][a] = parseFloat(chartData[1][a]).toFixed(0);	
				}	
				dataRow.push(labelArr[a],parseFloat(chartData[0][a]),parseFloat(chartData[1][a]));
				dataArr.push(dataRow);
				if(0 == chartData[0][a] || 0 == chartData[1][a]){dataZeroYn = 'Y';}
			}
			format = format+"명"; 
			legend = {'position':'top','alignment':'center'};
			chartArea = {left:50, top:30, width:'80%',height:'70%'};
			colors = ['#6f82fe','#5ac4e6'];
		}
		
		if('deliveryTimeDay' == canvasNm || 'deliveryTimeWeek' == canvasNm || 'homeCardDeliveryChart' == canvasNm){
			if('Y' == dataZeroYn){
				vAxis = {textPosition : 'none', viewWindow:{min : 0}, format:"###,###" + format};
			}else{
				vAxis = {textPosition : 'none', format:"###,###" + format};
			}
		}else{
			if('Y' == dataZeroYn){
				//vAxis = {title : format, viewWindow:{min : 0}};
				vAxis = {viewWindow:{min : 0}, format:"###,###" + format};
			}else{
				//vAxis = {title : format};
				vAxis = {format:"###,###" + format};
			}
		}
		
		var data = google.visualization.arrayToDataTable(dataArr);
		
		var options = {	
			legend : legend,
			tooltip: {  ignoreBounds:true, isHtml: true },
			colors: colors,
			crosshair: { 
				trigger: 'focus' ,
				orientation: 'vertical'
			},
			focusTarget : 'category',
			hAxis: {
				//slantedText:false,
				//slantedTextAngle : 90,
				minTextSpacing : 0
			},
			vAxis: vAxis,
			chartArea:chartArea,
			curveType: 'function'
		};
		
		var chart;
		if('analy' == tabCd || '' == tabCd){
			chart = new google.visualization.LineChart(document.querySelector('#districtMain #'+canvasNm));
		}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
			chart = new google.visualization.LineChart(document.querySelector('.matTab_bottom #'+canvasNm));
		}else if('homeCard' == tabCd){
			chart = new google.visualization.LineChart(document.querySelector('.homeDistrict #'+canvasNm));
		}
		
		var container;
		//배달 시간별 요일별 차트시 날씨 아이콘을 point 위에 올림
		if('deliveryTimeDay' == canvasNm || 'deliveryTimeWeek' == canvasNm || 'homeCardDeliveryChart' == canvasNm){
			if(0 != iconArr.length){
				if('analy' == tabCd || '' == tabCd){
					container = document.querySelector('#districtMain #'+canvasNm);
				}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
					container = document.querySelector('.matTab_bottom #'+canvasNm);
				}else if('homeCard' == tabCd){
					container = document.querySelector('.homeDistrict #'+canvasNm);
				}
				
				google.visualization.events.addListener(chart, 'ready', weatherIcon);
			}
		}
		
	     function weatherIcon(){	//마커  변경
	          var layout = chart.getChartLayoutInterface();
	          for (var i = 0; i < data.getNumberOfRows(); i++) {
	        	  if('WT02' == iconArr[i] || 'WT04' == iconArr[i]){
		        	  //WT01	맑음
		        	  //WT02	비옴
		        	  //WT03	흐림
		        	  //WT04	눈
		              var xPos = layout.getXLocation(i);
		              var yPos = layout.getYLocation(data.getValue(i,1));
//		              yPos = 0;
		              var iconImg = container.appendChild(document.createElement('img'));
		              if('WT02' == iconArr[i]){		//비
		            	  iconImg.src = '../ca-static/img/01-icon-weather-smallicon-ic-rain-small.png';
		              }else if('WT04' == iconArr[i]){	//눈
		            	  iconImg.src = '../ca-static/img/01-icon-weather-smallicon-ic-snow-small.png';
		              }
		              iconImg.className = 'weatherIcon';
		              var divTop = container.offsetTop;
		              //iconImg.style.top = (divTop + yPos - 15) + 'px';
		              var divHeight = container.offsetHeight;
		              iconImg.style.top = divHeight + 'px';
		              iconImg.style.left = (xPos - 15) + 'px';
		              iconImg.style.position = 'absolute';
	        	  }
	          }  
	      }
		
	    google.visualization.events.addListener(chart, 'onmouseout', onmouseout);
	    function onmouseout(){
			//console.log(canvasNm);
			if('analy' == tabCd || '' == tabCd){
				$('#districtMain #'+canvasNm+'Tooltip').hide();
			}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
				$('.matTab_bottom #'+canvasNm+'Tooltip').hide();
			}else if('homeCard' == tabCd){
				$('.homeDistrict #'+canvasNm+'Tooltip').hide();
			}
			chart.setSelection();
			
	    }
	    
	    google.visualization.events.addListener(chart, 'onmouseover', onMouseOver);
		function onMouseOver(e) { 
			//영역 안 top
			var cli = chart.getChartLayoutInterface();
			var cliTop = cli.getChartAreaBoundingBox().top;
			//div 시작 top
			var div;
			if('analy' == tabCd || '' == tabCd){
				div = document.querySelector('#districtMain #'+canvasNm);
			}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
				div = document.querySelector('.matTab_bottom #'+canvasNm);
			}else if('homeCard' == tabCd){
				div = document.querySelector('.homeDistrict #'+canvasNm);
			}
			var divTop = div.getBoundingClientRect().top;
			var divRight = div.getBoundingClientRect().right;
			var divLeft = div.getBoundingClientRect().left;
			
			//그래프에서 x축
			var tooltipLeft;
		
			//정보 뿌리기
			var row = e.row;
			var infoText = "";
			if(row != null){ 
/*				if('salesChangeWeek' == canvasNm || 'salesChangeTime' == canvasNm || 'salesChangeMonth' == canvasNm){	//매출변화 차트
					infoText += data.getValue(row, 0);
					infoText += "  ";
					infoText += data.getValue(row, 1);
					infoText += format;
					$('#salesChangeDataInfo').text(infoText);
				}else if('deliveryTimeDay' == canvasNm || 'deliveryTimeWeek' == canvasNm){	//배달 시간대별 요일별 차트
					infoText += data.getValue(row, 0);
					infoText += "  ";
					infoText += data.getValue(row, 1);
					infoText += format;
					$('#deliveryDataInfo').text(infoText);
				}else if('livingTime' == canvasNm || 'moveTime' == canvasNm){	//생활인구 시간대별 차트
					infoText += "평균";
					infoText += "  ";
					infoText += chartData[2][row];
					infoText += format;
					if('livingTime' == canvasNm){$('#livingDataInfo').text(infoText);}
					if('moveTime' == canvasNm){$('#moveDataInfo').text(infoText);}
				}else if('livingJob' == canvasNm){	//생활인구 학생/직장인 차트
					infoText += "평균";
					infoText += "  ";
					var value = (chartData[0][row] + chartData[0][row])/2; 
					infoText += value;
					infoText += format;
					$('#livingJobDataInfo').text(infoText);
				}*/
				tooltipLeft = cli.getXLocation(row);
				chart.setSelection([e]); 
			}else{
				return;
			}
			
			//툴팁
			var $tooltip;
			if('analy' == tabCd || '' == tabCd){
				$tooltip = $('#districtMain #'+canvasNm+'Tooltip');
			}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
				$tooltip = $('.matTab_bottom #'+canvasNm+'Tooltip');
			}else if('homeCard' == tabCd){
				$tooltip = $('.homeDistrict #'+canvasNm+'Tooltip');
				//$tooltip.show();
			}
			//툴팁 내용 정의
			var tooltipText = "";
			if('salesChangeWeek' == canvasNm){	//매출변화 요일별
				tooltipText += data.getValue(row, 0);
				tooltipText += " | ";
				tooltipText += data.getValue(row, 1);
				tooltipText += format;
			}else if('salesChangeTime' == canvasNm){//매출변화 시간대별
				tooltipText += data.getValue(row, 0);
				tooltipText += " | ";
				tooltipText += data.getValue(row, 1);	
				tooltipText += format;
			}else if('salesChangeMonth' == canvasNm){//매출변화 월별
				if(3 == chartData.length){	//우편번호,행정동
					/*tooltipText += data.getValue(row, 0);
					tooltipText += " | ";*/
					tooltipText += "상위";
					tooltipText += chartData[0][row];
					tooltipText += format;
					tooltipText += "</br>";
					tooltipText += "평균";
					tooltipText += chartData[1][row];
					tooltipText += format;
					tooltipText += "</br>";
					tooltipText += "하위";
					tooltipText += chartData[2][row];
					tooltipText += format;
				}else if(1 == chartData.length){	//시군구
					tooltipText += data.getValue(row, 0);
					tooltipText += " | ";
					tooltipText += "평균";
					tooltipText += data.getValue(row, 1);
					tooltipText += format;
				}
			}else if('deliveryTimeDay' == canvasNm){//배달 시간대별 
				tooltipText += data.getValue(row, 0);
				//tooltipText += " | ";
				//tooltipText += "평균";
				//tooltipText += data.getValue(row, 1);
				//tooltipText += format;
			}else if('deliveryTimeWeek' == canvasNm){//배달 요일별 
				tooltipText += data.getValue(row, 0); 
				//tooltipText += "요일";
				//tooltipText += " | ";
				//tooltipText += data.getValue(row, 1);
				//tooltipText += format;
			}else if('homeCardDeliveryChart' == canvasNm){//홈카드 배달	
				tooltipText += data.getValue(row, 0); 
			}else if('livingTime' == canvasNm || 'moveTime' == canvasNm){	//생활인구 시간대별 차트
				//tooltipText += data.getValue(row, 0);
				//tooltipText += " | ";
				//tooltipText += chartData[2][row];
				//tooltipText += format;
				
				tooltipText += "평일";
				tooltipText += chartData[1][row];
				tooltipText += format;
				tooltipText += "</br>";
				tooltipText += "평균";
				tooltipText += chartData[2][row];
				tooltipText += format;
				tooltipText += "</br>";
				tooltipText += "휴일";
				tooltipText += chartData[0][row];
				tooltipText += format;	
			}else if('livingJob' == canvasNm){	//생활인구 학생/직장인 차트
				//tooltipText += data.getValue(row, 0);
				//tooltipText += " | ";
				var value = (parseFloat(chartData[0][row]) + parseFloat(chartData[1][row]))/2; 
				//tooltipText += value.toFixed(1);
				//tooltipText += format;
				tooltipText += "학생";
				tooltipText += chartData[0][row];
				tooltipText += format;
				tooltipText += "</br>";
				tooltipText += "평균";
				tooltipText += value.toFixed(1);
				tooltipText += format;
				tooltipText += "</br>";
				tooltipText += "직장인";
				tooltipText += chartData[1][row];
				tooltipText += format;
				
			}
			$tooltip.html(tooltipText);
			//툴팁 위치 조정
			if(('salesChangeMonth' == canvasNm && 3 == chartData.length) || ('livingTime' == canvasNm || 'moveTime' == canvasNm || 'livingJob' == canvasNm)){//툽팁으로 세가지 정보를 나타냄
				
				$tooltip.css({
					height : "73px",
					top : "-43px",
					fontSize : "9px"
				}).show();
				
				if(tooltipLeft+divLeft+parseFloat($tooltip.css('width')+1)/2 + 10 > divRight){	//툴팁이 잘릴경우
					$tooltip.css({
						left: divRight - parseFloat($tooltip.css('width')) - 10 - divLeft -1	//영역오른쪽 - 툴팁의가로 -마진 -  영역 왼쪽 -1(소수점)
					});
					
				}else{
					$tooltip.css({
						left: tooltipLeft - parseFloat($tooltip.css('width'))/2 - 5
					});
				}
					
			}else if('homeCard' == tabCd){	//홈카드 배달 차트
				$tooltip.css({
					top: cliTop - parseInt($tooltip.css('height')),
					left: tooltipLeft,
					fontSize : "9px"
				}).show();
			}else{
				$tooltip.css({
					top: cliTop - parseInt($tooltip.css('height')),
					fontSize : "9px"
				}).show();
				
				if(tooltipLeft+divLeft+parseFloat($tooltip.css('width')+1)/2 + 10 > divRight){	//툴팁이 잘릴경우
					$tooltip.css({
						left: divRight - parseFloat($tooltip.css('width')) - 10 - divLeft -1	//영역오른쪽 - 툴팁의가로 -마진 -  영역 왼쪽 -1(소수점)
					});
					
				}else{
					$tooltip.css({
						left: tooltipLeft - parseFloat($tooltip.css('width'))/2 - 5
					});
				}				
				
			}
			
			//네이티브 로그 전달에 사용하는 변
			var viewCurr = "";
			var actionDetail1 = "";
			var actionDetail2 = "";
			var actionDetail3 = "";
			var actionDetail4 = data.getValue(row, 0);
			
			if('salesChangeMonth' == canvasNm || 'salesChangeWeek' == canvasNm || 'salesChangeTime' == canvasNm){	
				if('salesChangeMonth' == canvasNm){actionDetail1 = "G_MONTH";}
				else if('salesChangeWeek' == canvasNm){actionDetail1 = "G_DOW";}
				else if('salesChangeTime' == canvasNm){actionDetail1 = "G_TMZN";}
				actionDetail2 = metalogViewId(73);
				actionDetail3 = "주변 상권 매출";
			}else if('deliveryTimeDay' == canvasNm || 'deliveryTimeWeek' == canvasNm){
				if('deliveryTimeDay' == canvasNm){actionDetail1 = "G_TMZN";}
				else if('deliveryTimeWeek' == canvasNm){actionDetail1 = "G_DOW";}
				actionDetail2 = metalogViewId(79);
				actionDetail3 = "배달 주문 분석";
			}else if('livingTime' == canvasNm){
				actionDetail1 = "G_TMZN";
				actionDetail2 = metalogViewId(85);
				actionDetail3 = "시간대별 비교";
			}else if('livingJob' == canvasNm){
				actionDetail1 = "G_OCPN";
				actionDetail2 = metalogViewId(85);
				actionDetail3 = "학생/직장인 분포";
			}else if('moveTime' == canvasNm){//유동인구 영역
				actionDetail1 = "G_TMZN";
				actionDetail2 = metalogViewId(85);
				actionDetail3 = "시간대별 비교";
			}
			
			
			if('' == tabCd || 'analy' == tabCd){ //우리상권분석 탭
				viewCurr = metalogViewId(68);
			}else if('slin' == tabCd){			//매출탭
				viewCurr = metalogViewId(71);
			}else if('fddl' == tabCd){			//배달탭
				viewCurr = metalogViewId(77);
			}else if('lvpopl' == tabCd){		//전단지탭
				viewCurr = metalogViewId(83);
			}
			
			/*
				액션로그 적재 정보
				문서이름 : 소호앱_액션로그_시나리오_v1.5_220218_메타취합.xlsx
				화면 구문 : 상권분석 > 우리상권분석 
				상세 기능 : 그래프값 상세보기
				액션번호 : 180
			*/
			
			var nativeDataNew={
				"viewCurr" : viewCurr
				,"viewCurrDtl" : viewCurr	
				,"actionType" : "CLICK_GRAPH"
				,"actionDetail1" : actionDetail1
				,"actionDetail2" : actionDetail2
				,"actionDetail3" : actionDetail3
				,"actionDetail4" : actionDetail4
			};
			
			nativeStart('USER_ACTION_LOG',nativeDataNew);			
		} 		

		chart.draw(data, options); 
		
		if('salesChangeWeek' == canvasNm){	//매출변화 요일별
			$('.tabcnt_change1').removeClass('active');
		}else if('salesChangeTime' == canvasNm){//매출변화 시간대별
			$('.tabcnt_change2').removeClass('active');
		}else if('deliveryTimeWeek' == canvasNm){//배달 요일별 
			$('.tabcnt_state1').removeClass('active');
		}
	}
	 
	
}


//도넛차트
function googleDonutChart(canvasNm,chartData,labelArr){	//canvasNm : 차트 그려질 영역, chartData : 데이터, labelArr : 라벨 기준	
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var dataArr = [];					//차트 포맷에 맞는 배열
		var dataRow = [];
		//옵션들 정의
		var chartArea;
		var pieSliceTextStyle;
		var pieHole;
		var legend;
		var slices;
		var backgroundColor;
		
		if('salesGender' == canvasNm || 'deliveryGender' == canvasNm || 'livingGender' == canvasNm || 'moveGender' == canvasNm){	//성별
			backgroundColor = 'white';
			legend = {position : 'bottom',alignment:'center' };;
			chartArea = {left:15,top:15,width:'80%',height:'70%'};
			pieSliceTextStyle = {fontSize: 16 , color: '#000000'};
			pieHole = 0.6;
			slices = {0: { color: '#6f82fe' }, 1: { color: '#5ac4e6'  }};
		}else if('deliveryUseApp' == canvasNm){ //플랫폼
			if('analy' == tabCd || '' == tabCd){
				backgroundColor = '#6a68f5';
				legend ={position : 'top', maxLines : 3, textStyle: {color: 'white'}};
				//플랫폼 ux 재현
				//legend ={position : 'right', maxLines : 3, textStyle: {color: 'white'}, alignment: 'center'};
			}else if('fddl' == tabCd){
				backgroundColor = 'white';
				legend ={position : 'top', maxLines : 3};
				//플랫폼 ux 재현
				//legend ={position : 'right', maxLines : 3,alignment: 'center'};
			}
			chartArea = {left:15,top:30,width:'83%',height:'80%'};
			//플랫폼 ux 재현
			//chartArea = {left:0,top:0,width:'100%',height:'100%'};
			pieSliceTextStyle = {fontSize: 10 , color: '#000000'}
			pieHole = 0.3;
			slices = {0: { color: '#85d5fe' }, 1: { color: '#9797ff'  },2: { color: '#c1b5f7'  },3: { color: '#eeedf1'  },4: { color: '#CCFFE5'  }};
		}else if('orgDeliveryDataArea' == canvasNm || 'targetDeliveryDataArea' == canvasNm){ //상권비교
			backgroundColor = 'white';
			legend ={position : 'none', maxLines : 3};
			chartArea = {left:0,top:10,width:'100%',height:'85%'};
			pieSliceTextStyle = {fontSize: 10 , color: '#000000'}
			pieHole = 0.3;
			
			var sliceColorArr=[];
			
			for(var a=0; a<labelArr.length; a++){
				if('배달의민족' == labelArr[a]){sliceColorArr.push('#7383e5');}
				else if('쿠팡이츠' == labelArr[a]){sliceColorArr.push('#a093db');}
				else if('요기요' == labelArr[a]){sliceColorArr.push('#85d5fe');}
				else if('배달특급' == labelArr[a]){sliceColorArr.push('#d5d3eb');}
				else if('기타' == labelArr[a]){sliceColorArr.push('#eeedf1');}
			}
			
			slices = {0: { color: sliceColorArr[0] }, 1: { color: sliceColorArr[1]  },2: { color: sliceColorArr[2]  },3: { color: sliceColorArr[3]  },4: { color: sliceColorArr[4]  },5: { color: sliceColorArr[5]  }};
			
		}
		dataRow.push('gender','value');
		dataArr.push(dataRow);
		
		for(var a=0; a<chartData.length; a++){
			dataRow = [];
			if('salesGender' == canvasNm || 'deliveryGender' == canvasNm || 'livingGender' == canvasNm || 'moveGender' == canvasNm){	//성별
				dataRow.push(labelArr[a],Math.round(chartData[a]));
			}else{
				dataRow.push(labelArr[a],parseInt(chartData[a]));
			}
			dataArr.push(dataRow);
		}
		var data = google.visualization.arrayToDataTable(dataArr);
		var options = {
			legend : legend,
			pieStartAngle: 360,
			slices: slices,
	        pieHole: pieHole,
	        pieSliceTextStyle : pieSliceTextStyle,
	        chartArea: chartArea,
	        backgroundColor : backgroundColor,
	        sliceVisibilityThreshold : 0, // other <--- 기준 0으로 변경 최창수 추가
	        tooltip : {text:'percentage', trigger : 'selection'}
		};	
		
		var chart;
		if('analy' == tabCd || '' == tabCd){	//우리상권분석
			chart = new google.visualization.PieChart(document.querySelector('#districtMain #'+canvasNm));
		}else{	//지도탭
			if('orgDeliveryDataArea' == canvasNm || 'targetDeliveryDataArea' == canvasNm){	//상권비교에서 사용
				chart = new google.visualization.PieChart(document.getElementById(canvasNm));	
			}else{
				chart = new google.visualization.PieChart(document.querySelector('.matTab_bottom #'+canvasNm));
			}
		}
		
		google.visualization.events.addListener(chart, 'onmouseover', onMouseOver);
		function onMouseOver(e) { 	
			var row = e.row;
		}
		
	    chart.draw(data, options);
	    
	}
}

//세로 막대 차트(컬럼 차트)
function googleColumnChart(canvasNm,chartData,labelArr,maxValue,iconArr){	//canvasNm : 차트 그려질 영역, chartData : 데이터, labelArr : 라벨 기준
	google.charts.setOnLoadCallback(drawChart);
	//console.log(chartData);
	function drawChart() {
		var dataArr = [];					//차트 포맷에 맞는 배열
		var dataRow = [];
		var color = '#cbcce9';				//막대 색상
		var annotationVal = '';				//막대 그래프 위에 값(value)
		var chartArea;
		var series;
		var annotations;
		var viewWindow;
		if('salesAge' == canvasNm || 'deliveryAge' == canvasNm || 'livingAge' == canvasNm || 'movegAge' == canvasNm){	//연령대별 막대그래프 
			dataRow.push('age','', { role: 'style' },{type: 'string', role: 'annotation'});
			dataArr.push(dataRow);	
			chartArea = {left:5,top:0,width:'100%',height:'80%'};
			series = {};
			annotations = { alwaysOutside : true , textStyle: {bold: true, fontSize: 16, } };
			viewWindow = {min : 0, max : maxValue+10};
		}else if('deliveryTimeWeek' == canvasNm || 'deliveryTimeDay' == canvasNm|| 'homeCardDeliveryChart' == canvasNm){	//배달 현황
			dataRow.push('time','', { role: 'style' },{type: 'string', role: 'annotation'},'평균',{type: 'string', role:'annotation'});
			dataArr.push(dataRow);	
			chartArea = {left:0,top:0,width:'100%',height:'80%'};
			series ={
				1:{
					type:'line',
					color : '#2e2e30',
					lineWidth: 1,
					lineDashStyle: [5,5],
					tooltip : {trigger : 'none'}
				}
			};
			annotations = { alwaysOutside : true , textStyle: {bold: true, fontSize: 16, } };
			viewWindow = {min : 0, max : maxValue+10};
		}
		
		for(var a=0; a<chartData.length; a++){
			dataRow = [];
			
			if(maxValue == parseInt(chartData[a])){	//최대값만 색을변경
				color = '#6a40c0';
			}
			
			annotationVal = chartData[a]+'%';
			if('deliveryTimeWeek' == canvasNm || 'deliveryTimeDay' == canvasNm || 'homeCardDeliveryChart' == canvasNm){	//배달 현황
				var lineAnnotation = null;
				//if(a == 0 ){lineAnnotation = '평균값';}
				if('deliveryTimeWeek' == canvasNm || 'homeCardDeliveryChart' == canvasNm){
					dataRow.push(labelArr[a].replace('(','\n('),parseInt(chartData[a]),color,annotationVal,14.2,lineAnnotation);
				}else{
					dataRow.push(labelArr[a],parseInt(chartData[a]),color,annotationVal,14.2,lineAnnotation);
				}
			}else{
				dataRow.push(labelArr[a],parseInt(chartData[a]),color,annotationVal);
			}
			dataArr.push(dataRow);
			
			color = '#cbcce9';	//초기화
			annotationVal = '';	//초기화	
		}
		
		var data = google.visualization.arrayToDataTable(dataArr);
		var options = {
			legend: { position: "none" },
			hAxis : {
				minTextSpacing : 3
			},
			vAxis : {
				textPosition : 'none',
				gridlines: {
			        color: 'transparent'
			    },
			    viewWindow:viewWindow
			},
			annotations: annotations,
		    chartArea:chartArea,
		    tooltip : {trigger : 'selection'},
		    series:series
		}
		
		var formatter = new google.visualization.NumberFormat(
				{suffix:'%',fractionDigits:0}
		);
		formatter.format(data, 1); // format column 1
		
		var chart;
		if('analy' == tabCd || '' == tabCd){
			chart = new google.visualization.ColumnChart(document.querySelector('#districtMain #'+canvasNm));
		}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
			chart = new google.visualization.ColumnChart(document.querySelector('.matTab_bottom #'+canvasNm));
		}else if('homeCard' == tabCd){
			chart = new google.visualization.ColumnChart(document.querySelector('.homeDistrict #'+canvasNm));
		}
		
		google.visualization.events.addListener(chart, 'onmouseover', onMouseOver);
		function onMouseOver(e) { 	
			var row = e.row;
			
			//네이티브 로그 전달에 사용하는 변
			/*var viewCurrDtl = "";
			var actionDetail1 = "";
			var actionDetail2 = "";
			var actionDetail3 = "";
			var actionDetail4 = data.getValue(row, 0);
			
			if('salesAge' == canvasNm ){	
				actionDetail2 = "우리 상권 매출";
				actionDetail3 = "연령대 분포";
			}else if('deliveryAge' == canvasNm){
				actionDetail2 = "배달 주문 분석";
				actionDetail3 = "연령대 분포";
			}else if('livingAge' == canvasNm){
				actionDetail2 = "생활인구 분석";
				actionDetail3 = "연령대 분포";
			}else if('movegAge' == canvasNm){
				actionDetail2 = "유동인구 분석";
				actionDetail3 = "연령대 분포";
			}else if('deliveryTimeWeek' == canvasNm || 'deliveryTimeDay' == canvasNm){
				actionDetail2 = "배달 주문 분석";
				if('deliveryTimeDay' == canvasNm){actionDetail3 = "시간대별 배달 현황";}
				else if('deliveryTimeWeek' == canvasNm){actionDetail3 = "요일별 배달 현황";}
			}
			
			viewCurrDtl = "우리상권분석";
			actionDetail1 = "우리상권분석_그래프클릭";
			*/
			//액션 로그 적재
			/*var nativeParam;
			nativeParam={
				"actionType" : "CLICK"
				,"actionDetail1" : actionDetail1
				,"actionDetail2" : actionDetail2
				,"rspTime" : ""
				,"viewCurr" : ""
				,"viewCurrDtl" : viewCurrDtl							
				,"actionDetail3" : actionDetail3	
				,"actionDetail4" : actionDetail4	
				,"actionDetail5" : ""	
				,"actionDetail6" : ""
				,"actionDetail7" : ""
				,"r1" : ""
				,"r2" : ""
				,"r3" : ""
				,"r4" : ""
				,"r5" : ""
			}*/
			//nativeStart('USER_ACTION_LOG',nativeParam);		
		}
		
		if('deliveryTimeDay' == canvasNm || 'deliveryTimeWeek' == canvasNm || 'homeCardDeliveryChart' == canvasNm){
			var container;
			//배달 시간별 요일별 차트시 날씨 아이콘을 point 위에 올림
			if(0 != iconArr.length){
				if('analy' == tabCd || '' == tabCd){
					container = document.querySelector('#districtMain #'+canvasNm);
				}else if('slin' == tabCd || 'fddl' == tabCd || 'lvpopl' == tabCd){
					container = document.querySelector('.matTab_bottom #'+canvasNm);
				}else if('homeCard' == tabCd){
					container = document.querySelector('.homeDistrict #'+canvasNm);
				}
				
				google.visualization.events.addListener(chart, 'ready', weatherIcon);
			}
	
			function weatherIcon(){	//마커  변경
			  var layout = chart.getChartLayoutInterface();
			  for (var i = 0; i < data.getNumberOfRows(); i++) {
				  if('WT02' == iconArr[i] || 'WT04' == iconArr[i]){
					  //WT01	맑음
					  //WT02	비옴
					  //WT03	흐림
					  //WT04	눈
					  var xPos = layout.getXLocation(i);
					  var yPos = layout.getYLocation(data.getValue(i,1));
	//				              yPos = 0;
					  var iconImg = container.appendChild(document.createElement('img'));
					  if('WT02' == iconArr[i]){		//비
						  iconImg.src = '/ca-static/img/01-icon-weather-smallicon-ic-rain-small.png';
					  }else if('WT04' == iconArr[i]){	//눈
						  iconImg.src = '/ca-static/img/01-icon-weather-smallicon-ic-snow-small.png';
					  }
					  iconImg.className = 'weatherIcon';
					  var divTop = container.offsetTop;
		              //iconImg.style.top = (divTop + yPos - 15) + 'px';
		              var divHeight = container.offsetHeight;
		              iconImg.style.top = (divHeight - 10) + 'px';
		              iconImg.style.left = (xPos - 15) + 'px';
		              iconImg.style.position = 'absolute';
				  }
			  }  
			}
		}
		chart.draw(data, options);
		
		if('deliveryTimeWeek' == canvasNm){//배달 요일별 
			$('.tabcnt_state1').removeClass('active');
		}
		
	}
	
}

