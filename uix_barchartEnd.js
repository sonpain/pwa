//import {jquery_ui, ckEdit_css}  from './lib.js';

var popContData = '';
var btnArea = 'text';
var contentValue = "edit";
var popDrag = false;
var popSize = false;

// 함수 정의
function removeAllClasses(selector, className) {
    document.querySelectorAll(selector).forEach(function(element) {
        element.classList.remove(className);
    });
}

function copyCodeToClipboard() {
    var code = this.nextElementSibling.querySelector('code').textContent;
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    this.classList.add('ok');
}

function handleInputValueUpdate() {
    document.documentElement.style.setProperty('--' + this.name, this.value);
}

function handleRadioButtonChange() {
    if (this.checked) {
        if (this.value === 'option1') {
            btnPosition.style.display = '';
            btnArea = 'text';
            chartID.style.display = 'none';
        } else if (this.value === 'option2') {
            btnPosition.style.display = 'none';
            chartID.style.display = 'block';
            btnArea = 'chart';
        }
    }
}

function handlePopupContentChange() {
    if (this.checked) {
        if (this.value === 'option1') {
            filterNum.style.display = 'none';
            editorReview.style.display = '';
            filterReview.style.display = 'none';
            optionReview.style.display = 'none';
            contentValue = "edit";
        } else if (this.value === 'option2') {
            filterNum.style.display = 'block';
            editorReview.style.display = 'none';
            filterReview.style.display = '';
            optionReview.style.display = 'none';
            contentValue = "filter";
        } else {
            filterNum.style.display = 'none';
            editorReview.style.display = 'none';
            filterReview.style.display = 'none';
            optionReview.style.display = '';
            contentValue = "chart";
        }
    }
}

function handleCheckboxChange() {
    if (this.checked) {
        if (this.value === 'drag') {
            popDrag = true;
        } else if (this.value === 'resize') {
            popSize = true;
        }
    } else {
        if (this.value === 'drag') {
            popDrag = false;
        } else if (this.value === 'resize') {
            popSize = false;
        }
    }
}

// 이벤트 리스너 등록
document.querySelectorAll('.accordion-panel-header').forEach(function(element) {
    element.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.classList.contains('on')) {
            removeAllClasses('.accordion-panel-header', 'on');
            removeAllClasses('.accordion .collapse', 'show');
        }else{
            removeAllClasses('.accordion-panel-header', 'on');
            removeAllClasses('.accordion .collapse', 'show');
            this.classList.add('on');
            var collapse = this.nextElementSibling;
            collapse.classList.add('show');
        }
        
    });
});

document.querySelectorAll('.modal .close').forEach(function(element) {
    element.addEventListener('click', function() {
        document.body.classList.remove('modal-open');
        var modal = this.closest('.modal');
        modal.classList.remove('show');
        modal.removeAttribute('style');
        document.querySelector('.accordion .copy').classList.remove('ok');
    });
});

document.querySelectorAll('.copy').forEach(function(element) {
    element.addEventListener('click', copyCodeToClipboard);
});

document.querySelectorAll('.opt input').forEach(function(input) {
    input.addEventListener('change', handleInputValueUpdate);
});

const radioButtons = document.querySelectorAll('.radioChk input[type="radio"]');
const btnPosition = document.querySelector('.btnPosition');
const chartID = document.querySelector('.chartID');

radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', handleRadioButtonChange);
});

const popConts = document.querySelectorAll('.popupCon input[type="radio"]');
const filterNum = document.querySelector('.filterNum');
const editorReview = document.querySelector('.editorBtnWrap');
const filterReview = document.querySelector('.previewBtnWrap');
const optionReview = document.querySelector('.optionBtnWrap');

popConts.forEach(function(popCont) {
    popCont.addEventListener('change', handlePopupContentChange);
});

const checkBoxs = document.querySelectorAll('.custom-control-input');
checkBoxs.forEach(function(checkbox) {
    checkbox.addEventListener('change', handleCheckboxChange);
});

function updateVisibility(selectedChart) {
    const barChartWrap = document.querySelector('.barChartWrap');
    const lineChartWrap = document.querySelector('.lineChartWrap');
    const doughnutChartWrap = document.querySelector('.doughnutChartWrap');
    const tableWrap = document.querySelector('.tableWrap');

    // 모든 차트 div를 숨깁니다.
    barChartWrap.style.display = 'none';
    lineChartWrap.style.display = 'none';
    doughnutChartWrap.style.display = 'none';
    tableWrap.style.display = 'none';

    // 선택된 차트에 해당하는 div만 표시합니다.
    switch (selectedChart) {
        case 'bar':
            barChartWrap.style.display = 'block';
            break;
        case 'line':
            lineChartWrap.style.display = 'block';
            break;
        case 'doughnut':
            doughnutChartWrap.style.display = 'block';
            break;
        case 'table':
            tableWrap.style.display = 'block';
            break;
    }
}
const chartSelect = document.querySelector('.chartSelect');

chartSelect.addEventListener('change', () => {
    updateVisibility(chartSelect.value);
});

let dataSetCount = document.querySelectorAll('.dataSetsWrap > div').length;

function updateDataSetCount() {
    dataSetCount = document.querySelectorAll('.dataSetsWrap > div').length;
}

function addDataSet() {
    const lastDataSet = document.querySelector('.dataSetsWrap > div:last-child');
    const clonedDataSet = lastDataSet.cloneNode(true);

    // Increment dataSets class name
    dataSetCount++;
    const newDataSetClass = `dataSets${dataSetCount}`;
    clonedDataSet.classList.remove(clonedDataSet.classList[clonedDataSet.classList.length - 1]); // Remove the last class
    clonedDataSet.classList.add(newDataSetClass);

    // Increment input ID
    const lastInputId = lastDataSet.querySelector('.barDataInput').id;
    const inputNumber = parseInt(lastInputId.replace('barData', ''));
    const newInputNumber = inputNumber + 1;
    const newInputId = `barData${newInputNumber}`;
    clonedDataSet.querySelector('.barDataInput').id = newInputId;
    clonedDataSet.querySelector('.barDataInput').value = '';
    clonedDataSet.querySelector('.categoryName').value = '';
    clonedDataSet.querySelector('.chartColor').value = '';
    clonedDataSet.querySelector('.chartAxisSelect').value = 'y1';
    clonedDataSet.querySelector('.axisLineSelect').value = 'false';

    const dataSetsMenu = clonedDataSet.querySelector('.dataSetsMenu');
    const dataButton = dataSetsMenu.querySelector('li:first-child button');
    const menuItems = dataSetsMenu.querySelectorAll('li');
    menuItems.forEach(item => item.classList.remove('on'));
    dataButton.parentElement.classList.add('on');

    // Hide options if visible
    const dataDiv = clonedDataSet.querySelector('.dataSets_data');
    const optionsDiv = clonedDataSet.querySelector('.dataSets_option');
    dataDiv.style.display = 'block';
    optionsDiv.style.display = 'none';

    document.querySelector('.dataSetsWrap').appendChild(clonedDataSet);
}

function handleDataSetMenuClick(event) {
    const target = event.target;
    if (target.tagName !== 'BUTTON' || !target.closest('.dataSetsMenu')) return;
    
    const li = target.parentElement;
    const menuItems = li.parentElement.children;
    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('on');
    }
    li.classList.add('on');

    const dataSet = target.closest('.dataWrap');
    const dataSetsData = dataSet.querySelector('.dataSets_data');
    const dataSetsOption = dataSet.querySelector('.dataSets_option');

    // 모든 데이터 영역과 옵션 영역을 숨기기
    dataSetsData.style.display = 'none';
    dataSetsOption.style.display = 'none';

    // 'on' 클래스가 붙은 li 요소의 순서에 따라 해당하는 영역 보여주기
    const allLi = Array.from(dataSet.querySelectorAll('li'));
    const index = allLi.indexOf(li);
    if (index === 0) {
        dataSetsData.style.display = 'block';
    } else if (index === 1) {
        dataSetsOption.style.display = 'block';
    }
}
function handleRemoveDataSet(event) {
    if (event.target.classList.contains('removeDataSet')) {
        const dataSet = event.target.closest('.dataWrap');
        if (document.querySelectorAll('.dataSetsWrap > div').length === 1) {
            const removeInfo = dataSet.querySelector('.removeInfo');
            removeInfo.textContent = "더 이상 삭제할 수 없습니다.";
            setTimeout(() => {
                removeInfo.textContent = "";
            }, 1000);
        } else {
            dataSet.remove();
            updateDataSetCount();
            const dataSetElements = document.querySelectorAll('.dataSetsWrap > div');
            dataSetElements.forEach((element, index) => {
                const lastClassIndex = element.classList.length - 1;
                element.classList.remove(element.classList[lastClassIndex]);
                element.classList.add(`dataSets${index + 1}`);
            });
        }
    }
}

function handleOptionsMenuClick(index){
    optionsClick.forEach((btn, idx) => {
        if (idx === index) {
            btn.parentElement.classList.add('on');
        } else {
            btn.parentElement.classList.remove('on');
        }
    });
    // 모든 div 요소를 숨깁니다.
    optionsDiv.forEach((div, idx) => {
        // 클릭된 버튼에 해당하는 div 요소를 보여줍니다.
        if (idx === index) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}
document.querySelector('.addDataSet').addEventListener('click', addDataSet);

document.querySelector('.dataSetsWrap').addEventListener('click', function(event) {
    if (event.target.classList.contains('removeDataSet')) {
        handleRemoveDataSet(event);
    } else {
        handleDataSetMenuClick(event);
    }
});

const optionsClick = document.querySelectorAll('.optionsMenu button');
const optionsDiv = document.querySelectorAll('.option_common, .option_chart, .option_label, .option_legend, .option_tooltip');

// 각 버튼에 대한 클릭 이벤트를 추가합니다.
optionsClick.forEach((button, index) => {
    button.addEventListener('click', () => {
        handleOptionsMenuClick(index);
    });
});

//차트 옵션 설정
document.querySelector('.prevChart').addEventListener('click', function() {
    const chartData = prepareChartData();
    updateOrCreateChart(chartData);
    showPopupChart();
});

// 차트 데이터 준비
function prepareChartData() {
    const labels = collectLabels();
    const datasets = collectDatasets();
    const userOptions = collectUserOptions();
    const finalOptions = generateChartOptions(userOptions);
    return { labels, datasets, finalOptions };
}

// 레이블 수집
function collectLabels() {
    const labelDataInput = document.getElementById('labelData');
    return labelDataInput ? labelDataInput.value.split(',') : [];
}

// 데이터셋 수집
function collectDatasets() {
    return Array.from(document.querySelectorAll('.dataWrap')).map(dataWrap => {
        const dataset = {
            label: dataWrap.querySelector('.categoryName')?.value,
            data: dataWrap.querySelector('.barDataInput')?.value.split(','),
            backgroundColor: dataWrap.querySelector('.chartColor')?.value
        };
        const chartAxisSelect = dataWrap.querySelector('.chartAxisSelect');
        if (chartAxisSelect && chartAxisSelect.value) {
            dataset.yAxisID = chartAxisSelect.value;
        }
        return dataset;
    }).filter(dataset => dataset.label && dataset.data);
}


function collectUserOptions() {
    const options = {};
    const settings = [
        { id: 'barLogic', optionName: 'indexAxis', transform: v => v },
        { id: 'stackedBar', optionName: 'scales.x.stacked', transform: v => v === 'true' },
        { id: 'stackedBar', optionName: 'scales.y1.stacked', transform: v => v === 'true' },
        { id: 'labelCheck', optionName: 'plugins.datalabels.display', transform: v => v === 'true' },
        { id: 'labelPosition', optionName: 'plugins.datalabels.anchor', transform: v => v },
        { id: 'labelPosition', optionName: 'plugins.datalabels.align', transform: v => v },
        { id: 'legendCheck', optionName: 'plugins.legend.display', transform: v => v === 'true' },
        { id: 'legendPosition', optionName: 'plugins.legend.position', transform: v => v },
        { id: 'legendStyle', optionName: 'plugins.legend.labels.pointStyle', transform: v => v },
        { id: 'tooltipCheck', optionName: 'plugins.tooltip.enabled', transform: v => v === 'true' }
    ];
    settings.forEach(({ selector, optionPath, transform }) => {
        const element = document.querySelector(selector);
        if (element) {
            setOptionValue(options, optionPath, transform(element.value));
        }
    });

    collectCommonSettings(options); // 공통 설정 수집 함수 호출

    // 축 설정 및 글꼴 크기 입력 처리
    const fontSizeInput = document.getElementById('common-font-size');
    if (fontSizeInput && fontSizeInput.value) {
        const fontSize = parseFloat(fontSizeInput.value);
        setOptionValue(options, 'scales.x.ticks.font.size', fontSize);
        setOptionValue(options, 'scales.y1.ticks.font.size', fontSize);
        
        // y2 축의 존재 여부를 확인하고 설정
        const y2AxisSelected = Array.from(document.querySelectorAll('.chartAxisSelect')).some(select => select.value === 'y2');
        if (y2AxisSelected) {
            setOptionValue(options, 'scales.y2.ticks.font.size', fontSize);
        }
    }

    // 축 위치 선택 처리를 각 데이터 세트에 대해 개별적으로 적용
    document.querySelectorAll('.dataWrap').forEach(dataWrap => {
        const chartAxisSelect = dataWrap.querySelector('.chartAxisSelect');
        const axisLineSelect = dataWrap.querySelector('.axisLineSelect');

        if (chartAxisSelect && chartAxisSelect.value) {
            const axis = chartAxisSelect.value;
            const position = axis === 'y2' ? 'right' : 'left';
            setOptionValue(options, `scales.${axis}.position`, position);
        }

        if (axisLineSelect && chartAxisSelect && chartAxisSelect.value) {
            const axis = chartAxisSelect.value;
            const gridDisplay = axisLineSelect.value === 'true';
            setOptionValue(options, `scales.${axis}.grid.display`, gridDisplay);
        }
    });

    return options;

}
// 공통 설정 수집
function collectCommonSettings(options) {
    [
        { id: 'common-bg-color', type: 'color' },
        { id: 'bar-width', type: 'percent' },
        { id: 'bar-border-radius', type: 'number' },
        { id: 'label-font-size', type: 'number' },
        { id: 'label-font-color', type: 'color' },
        { id: 'legend-font-size', type: 'number' },
        { id: 'legend-font-color', type: 'color' },
        { id: 'tooltip-bg-color', type: 'color' },
        { id: 'tooltip-title-color', type: 'color' },
        { id: 'tooltip-content-color', type: 'color' }
    ].forEach(({ id, type }) => {
        const input = document.getElementById(id);
        if (input && input.value !== '') {
            const optionName = input.dataset.optionName;
            let value = input.value;
            switch (type) {
                case 'number':
                    value = parseFloat(value);
                    break;
                case 'color':
                    // 색상 코드는 그대로 사용
                    break;
                case 'percent':
                    value = parseFloat(value) / 100;
                    break;
                default:
                    // 기타 유형의 설정은 필요에 따라 여기서 처리
                    break;
            }
            setOptionValue(options, optionName, value);
        }
    });
}

// 옵션 값 설정
function setOptionValue(options, path, value) {
    const keys = path.split('.');
    let current = options;
    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = value;
        } else {
            current[key] = current[key] || {};
            current = current[key];
        }
    });
}

function deepMerge(target, source) {
    // 배열이거나 객체가 아닌 경우, source를 반환
    if (typeof source !== 'object' || source === null) {
        return source;
    }

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const value = source[key];
            // 대상 값이 배열이거나 원시 값인 경우, 복사
            if (typeof value !== 'object' || value === null) {
                target[key] = value;
            } else {
                // 값이 객체인 경우, 재귀 호출을 통해 깊은 복사 수행
                if (!target[key]) {
                    target[key] = Array.isArray(value) ? [] : {};
                }
                deepMerge(target[key], value);
            }
        }
    }
    return target;
}

function generateChartOptions(userOptions) {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        spanGaps: true,
        layout: { padding: { top: 45, bottom: 10, left: 10, right: 10 } },
        barPercentage: 0.9,
        borderRadius: 3,
        scales: { x: { position: "bottom", grid: { display: true } }, y1: { position: "left", grid: { display: false } } },
        plugins: {
            legend: { display: true, position: "top", labels: { usePointStyle: true, pointStyle: 'circle', color: '#000000' } },
            datalabels: { display: true, anchor: 'center', align: 'center', font: { size: 12 }, color: '#000' }
        }
    };
    return deepMerge(defaultOptions, userOptions);
}

// 차트 생성 또는 업데이트
function updateOrCreateChart({ labels, datasets, finalOptions }) {
    const ctx = document.getElementById('chartPreview').getContext('2d');
    const chartType = document.querySelector('.chartSelect').value;
    const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = options.color;
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    if (window.prevChart) {
        updateChart(window.prevChart, chartType, labels, datasets, finalOptions);
    } else {
        window.prevChart = createChart(ctx, chartType, labels, datasets, finalOptions, plugin);
    }
}
// 차트 생성
function createChart(ctx, type, labels, datasets, options, plugin) {
    return new Chart(ctx, {
        type,
        data: { labels, datasets },
        options,
        plugins: [plugin, ChartDataLabels] // 필요한 플러그인 추가
    });
}
// 차트 업데이트
function updateChart(chart, type, labels, datasets, options) {
    chart.config.type = type;
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.options = options;
    chart.update();
}

// 차트 팝업 표시
function showPopupChart() {
    document.querySelector('.popChartWrap').style.display = 'block';
    $(".popChartWrap").draggable({
        "cancel": ".popChartWrap .popChart",
        containment: ".chartOptionWrap",
        scroll: false
    });
    $(".popChartWrap").resizable({
        aspectRatio: true,
        resize: function() {
            //리사이즈 이벤트
            //prevChart.resize();
        }
    });
}


// closeBtn 버튼 클릭 시 팝업 닫기
document.querySelector('.popChartWrap .closeBtn').addEventListener('click', function() {
    document.querySelector('.popChartWrap').style.display = 'none';
});


document.querySelector('.optionBtn').addEventListener('click', function() {
    document.body.classList.add('modal-open');
    var modal = document.querySelector('#modal-option');
        modal.style.display = 'block';
        modal.classList.add('show');
        modal.setAttribute('style', 'display:block; padding-right:16px');
});

document.querySelector('.resultBtn').addEventListener('click', function() {
    //alertFn('팝업타이틀을 입력하세요');
    var p_title = document.querySelector('.titleInput').value;
    var p_width = document.querySelector('.puWInput').value;
    var p_height = document.querySelector('.puHInput').value;
    var p_top = document.querySelector('.puTInput').value;
    var p_left = document.querySelector('.puLInput').value;
    var b_title = document.querySelector('.btnTextInput').value;
    var b_top = document.querySelector('.btnTop').value;
    var b_left = document.querySelector('.btnLeft').value;
    var c_id = document.querySelector('.chartIDInput').value;
    var b_color =document.querySelector('.btnTxtColor').value;
    var b_bg =document.querySelector('.btnBGColor').value;
    var p_number = document.querySelector('.filterInput').value;

    if(p_title == ''){ p_title = '타이틀을 입력하세요' ;}
    if(p_width == ''){ p_width = '700px' ;}
    if(p_height == ''){ p_height = '500px' ;}
    if(p_top == ''){ p_top = '50px' ;}
    if(p_left == ''){ p_left = '50px' ;}
    if(b_title == ''){ b_title = '팝업열기' ;}
    if(b_top == ''){ b_top = '0px' ;}
    if(b_left == ''){ b_left = '0px' ;}

    document.body.classList.add('modal-open');
    var modal = document.querySelector('#modal-result');
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.setAttribute('style', 'display:block; padding-right:16px');

    var _html ='';
        if(btnArea == 'text'){
            _html +='<div class="btnWrap textArea"><button class="popOpen btn">'+ b_title +'</button></div>\n';
        }
        _html += '<div class="popup">\n';
        _html += '    <div class="titleWrap">\n';
        _html += '        <p class="title">'+ p_title +'</p><button class="closeBtn"><span>닫기</span></button>\n';
        _html += '    </div>\n';
        if(contentValue == "edit"){
            //console.log(popContData);
            if(popContData !=''){
                _html += '    <div class="contWrap ck-content">\n';
                _html += '        <div class="editWrap">\n';
                _html += '            '+ popContData +'\n';
                _html += '        </div>\n';
                _html += '    </div>\n';
            }else{
                _html += '    <div class="contWrap">\n\n';
                _html += '    </div>\n';
            }
            
        }else if(contentValue = "filter"){
            _html += '    <div class="contWrap filterWrap">\n';
            _html += '        <ul>\n';
                for (var i = 0; i < p_number; i++) {
                    _html += '            <li>\n';
                    _html += '                <div class="tit"><span>타이틀을입력하세요.</span></div>\n';
                    _html += '                <div class="cont"><!--필터/프로퍼티들어올자리입니다.--></div>\n';
                    _html += '            </li>\n';
                }
            _html += '        </ul>\n';
            _html += '    </div>\n';
        }
        _html += '</div>\n\n';

    var _css ='<style>\n';
        _css +=':root{\n';
        _css +='    --popup-width:'+ p_width +';\n';
        _css +='    --popup-height:'+ p_height +';\n';
        _css +='    --popup-position-top:'+ p_top +';\n';
        _css +='    --popup-position-left:'+ p_left +';\n';
        _css +='    --btn-position-top:'+ b_top +';\n';
        _css +='    --btn-position-left:'+ b_left +';\n';
        _css +='    --pbtn-text-color:'+b_color+';\n';
        _css +='    --pbtn-bg-color:'+b_bg+';\n';
        _css +='}\n';
        if(popSize || popDrag){
            _css +='.ui-icon {display: inline-block;vertical-align: middle;margin-top: -.25em;position: relative;text-indent: -99999px;overflow: hidden;background-repeat: no-repeat;}\n';
            _css +='.ui-resizable-handle {position: absolute;font-size: 0.1px;display: block;-ms-touch-action: none;touch-action: none;}\n';
            _css +='.ui-resizable-s {cursor: s-resize;height: 7px;width: 100%;bottom: -5px;left: 0;}\n';
            _css +='.ui-resizable-e {cursor: e-resize;width: 7px;right: -5px;top: 0;height: 100%;}\n';
            _css +='.ui-resizable-se {cursor: se-resize;width: 12px;height: 12px;right: 1px;bottom: 1px;}\n';
            _css +='.ui-icon {width: 16px;height: 16px;}\n';
            _css +=`.ui-icon,.ui-widget-content .ui-icon {background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='16px' height='16px' %3E%3Cg%3E%3Cpath style='opacity:1' fill='%23f9f9f9' d='M -0.5,-0.5 C 4.83333,-0.5 10.1667,-0.5 15.5,-0.5C 15.5,4.83333 15.5,10.1667 15.5,15.5C 10.1667,15.5 4.83333,15.5 -0.5,15.5C -0.5,10.1667 -0.5,4.83333 -0.5,-0.5 Z'/%3E%3C/g%3E%3Cg%3E%3Cpath style='opacity:1' fill='%23919191' d='M 11.5,1.5 C 12.525,1.89657 12.6917,2.56323 12,3.5C 9.16667,6.33333 6.33333,9.16667 3.5,12C 2.83333,12.6667 2.16667,12.6667 1.5,12C 5.03738,8.63087 8.37072,5.13087 11.5,1.5 Z'/%3E%3C/g%3E%3Cg%3E%3Cpath style='opacity:1' fill='%23909090' d='M 11.5,5.5 C 12.525,5.89657 12.6917,6.56323 12,7.5C 10.2599,9.95351 8.09326,11.4535 5.5,12C 7.70587,9.9633 9.70587,7.79663 11.5,5.5 Z'/%3E%3C/g%3E%3Cg%3E%3Cpath style='opacity:1' fill='%238b8b8b' d='M 11.5,9.5 C 12.6878,11.4959 12.0211,12.3293 9.5,12C 10.3805,11.2917 11.0472,10.4584 11.5,9.5 Z'/%3E%3C/g%3E%3C/svg%3E");}\n`;
        }
        if(btnArea == 'chart'){
            _css +='.sf-element-visual-title > .flex-item{overflow:unset !important;}\n';
        }
        _css +='/* 팝업 버튼 */\n';
        _css +='.popOpen{display:inline-block;font-weight:600;color:var(--pbtn-text-color);text-align:center;vertical-align:middle;-webkit-user-select:none;user-select:none;border:1px solid rgba(0,0,0,0.3);padding:6px 12px;line-height:1.5;border-radius:15px;font-size:15px;cursor:pointer;letter-spacing:-1px;background-color:var(--pbtn-bg-color);}\n';
        if(btnArea == 'chart'){
            _css +='.chartArea .popOpen{padding:4px 8px;font-size:13px;}';
            _css +='.chartArea ~ .chartArea{margin-left:10px;}';
        }else if(btnArea == 'text'){
            _css +='.btnWrap.textArea{position: absolute; top:var(--btn-position-top); left:var(--btn-position-left);}\n';
        }

        _css +='/* 팝업 CSS */\n';
        _css +='.popup{width: var(--popup-width);height:var(--popup-height);box-sizing: border-box;bottom: auto;position: fixed;  top:var(--popup-position-top); left: var(--popup-position-left); z-index:1;background:#fff;box-shadow: 0px 2px 8px rgba(0,0,0,0.5); overflow: hidden; border-radius: 10px;display:none;}\n';
        _css +='.popup p{margin:0;}\n';
        _css +='.popup .titleWrap{position: relative; background: #EF476F; padding: 0 45px 0 20px;cursor:move;}\n';
        _css +='.popup .titleWrap .title{font-size: 15px; line-height: 35px; font-weight: 600; color:#fff; }\n';
        _css +='.popup .closeBtn{display: block; position: absolute; top: 0; right: 0; width: 35px; height: 35px; background: rgba(0,0,0,.5); border:0; cursor: pointer;}\n';
        _css +='.popup .closeBtn span{display: block; width: 100%; height: 100%; font-size: 0; position: relative; transform: rotate(45deg);}\n';
        _css +='.popup .closeBtn span:before{content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; width: 18px; height: 2px; background: #fff; }\n';
        _css +='.popup .closeBtn span:after{content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; width: 18px; height: 2px; background: #fff; transform: rotate(90deg);}\n';

        if(contentValue == "edit"){
            if(popContData !=''){
                _css +='.popup .ck-content{padding: 20px; height:calc(100% - 45px); box-sizing:border-box;}\n';
                _css +='.editWrap{width:100%;height:100%;font-size:15px;}\n';
                _css +='/* edit content */\n';
                _css +=':root{--ck-color-image-caption-background:hsl(0,0%,97%);--ck-color-image-caption-text:hsl(0,0%,20%);--ck-color-mention-background:hsla(341,100%,30%,.1);--ck-color-mention-text:hsl(341,100%,30%);--ck-color-selector-caption-background:hsl(0,0%,97%);--ck-color-selector-caption-text:hsl(0,0%,20%);--ck-highlight-marker-blue:hsl(201,97%,72%);--ck-highlight-marker-green:hsl(120,93%,68%);--ck-highlight-marker-pink:hsl(345,96%,73%);--ck-highlight-marker-yellow:hsl(60,97%,73%);--ck-highlight-pen-green:hsl(112,100%,27%);--ck-highlight-pen-red:hsl(0,85%,49%);--ck-image-style-spacing:1.5em;--ck-inline-image-style-spacing:calc(var(--ck-image-style-spacing) / 2);--ck-todo-list-checkmark-size:16px}\n';
                //_css += ckEdit_css;
            }else{
                _css +='.popup .contWrap{padding: 20px; height:calc(100% - 45px); box-sizing:border-box;}\n';
            }
            
        }else if(contentValue = "filter"){
            _css +='.filterWrap{padding:10px; margin:5px; height:calc(100% - 45px);box-sizing:border-box;overflow: auto;}\n';
            _css +='.filterWrap ul{margin:0;padding:0 0 0 10px; display:flex; flex-flow: row wrap; justify-content: space-evenly;}\n';
            _css +='.filterWrap ul li{vertical-align:top;display:inline-block; padding:15px; margin-bottom: 10px;margin-right: 10px; border: 1px solid #D1D9E6; border-radius: 5px; background-color: #f1f1f1;}\n';
            _css +='.filterWrap ul li .tit {color:var(--contents-title-color); margin-bottom: 10px;}\n';
            _css +='.filterWrap ul li .tit span {font-size: 13px;font-weight: bold;vertical-align:middle;}\n';
            _css +='.filterWrap ul li .cont *{font-size:13px;}\n';
            _css +='/* scroll bar */\n';
            _css +='.filterWrap::-webkit-scrollbar{width:8px; height:8px;}\n';
            _css +='.filterWrap::-webkit-scrollbar-track{background:#dee2e6;border-radius:5px;}\n';
            _css +='.filterWrap::-webkit-scrollbar-track-piece{background:transparent;}\n';
            _css +='.filterWrap::-webkit-scrollbar-thumb{border-radius:5px;background:#EF476F; cursor:pointer;}\n';
        }
        _css +='</style>\n';

    var _js ='';
    var dot = "'";
        if(contentValue == "edit"){
            if(popContData ==''){
                _js +='// 차트 옵션 설정 함수\n';
                _js +='function setChartOptions() {\n';
                _js +='    return {\n';
                _js +='        //echart option 정의\n';
                _js +='    };\n';
                _js +='}\n';
                _js +='// 데이터 처리 함수\n';
                _js +='function processChartData() {\n';
                _js +='    //calculated value 데이터 가져와서 저장하기\n';
                _js +='}\n';
                _js +='// 팝업 차트 생성 함수\n';
                _js +='function createPopupChart() {\n';
                _js +='    //echart 선언\n';
                _js +='}\n';
            }
        }
        _js +='// 팝업 버튼 이벤트 처리 함수\n';
        _js +='function handlePopupButton() {\n';
        if(btnArea == "chart"){
            _js +='    var btnWrap ='+dot+'<div class="btnWrap chartArea"><button class="popOpen btn">'+ b_title +'</button></div>'+dot+';\n';
            _js +='    var targetElement = $('+ dot +'.sf-element-visual[sf-visual-id^="'+ c_id +'"] .sf-element-visual-title > div.flex-item'+dot+');\n';
            _js +='    if(!$(".sf-element-visual-title .btnWrap").length){\n';
            _js +='        targetElement.append(btnWrap);\n';
            _js +='    }\n';
        }
        _js +='    $(".popOpen").off("click").on("click", function() {\n';
        _js +='        $(".popup").show();\n';
        if(popSize){
            _js +='        // 차트 리사이즈 처리\n';
            _js +='        $(".popup").resizable({\n';
            _js +='            minHeight: 350,\n';
            _js +='            resize: function() {\n';
            _js +='               //리사이즈 이벤트\n';
            _js +='            }\n';
            _js +='        });\n';
        }
        if(popDrag){
            _js +='        // 차트 드래그 가능 처리\n';
            _js +='        $(".popup").draggable({\n';
            _js +='           "cancel": ".popup .contWrap",\n';
            _js +='            containment: ".PagesWebControl",\n';
            _js +='            scroll: false\n';
            _js +='        });\n';
        }
        _js +='        $(".popup .closeBtn").off("click").on("click", function() {\n';
        _js +='            $(".popup").hide();\n';
        _js +='        });\n';
        _js +='    });\n';
        _js +='}\n';
        if(btnArea == "chart"){
            _js +='// 팝업 관찰자 설정 함수\n';
            _js +='function setPopupObserver() {\n';
            _js +='    var popupObserver = new MutationObserver(() => {\n';
            _js +='        handlePopupButton();\n';
            _js +='    });\n';
            _js +='    var target = $('+ dot +'.sf-element-visual[sf-visual-id^="'+ c_id +'"]'+dot+')[0];\n';
            _js +='    var config = { attributes: false, childList: true, subtree: false };\n';
            _js +='    popupObserver.observe(target, config);\n';
            _js +='}\n';
        }
        _js +='// 문서 로드 완료 후 실행\n';
        _js +='$(document).ready(function() {\n';
        _js +='    setTimeout(() => handlePopupButton(), 300);\n';
        if(btnArea == "chart"){
            _js +='    setTimeout(() => setPopupObserver(), 500);\n';
        }
        _js +='});\n';
        
    var _plugin = '';
        if(popSize || popDrag){
            //_plugin += jquery_ui;
        }
    
    document.querySelector('.htmlResult').textContent = _html + _css;
    if(_plugin ==''){
        document.querySelector('.jsPluginWrap').style.display = 'none';
    }else{
        document.querySelector('.jsPlugin').textContent = _plugin;
    }
    
    document.querySelector('.jsResult').textContent = _js;
});

document.querySelector('.previewBtn').addEventListener('click', function() {
    const diff = document.querySelectorAll(".preview .popup .ck-content");
    if (diff.length > 0) {
        document.querySelector('.preview .popup').remove();
    }
    var p_title = document.querySelector('.titleInput').value;
    var p_width = document.querySelector('.puWInput').value;
    var p_height = document.querySelector('.puHInput').value;
    var p_top = document.querySelector('.puTInput').value;
    var p_left = document.querySelector('.puLInput').value;
    var p_number = document.querySelector('.filterInput').value;

    if(p_title == ''){ p_title = '타이틀을 입력하세요' ;}
    if(p_width == ''){ p_width = '700px' ;}
    if(p_height == ''){ p_height = '500px' ;}
    if(p_top == ''){ p_top = '0px' ;}
    if(p_left == ''){ p_left = '0px' ;}

    var _html = '';
        _html += '<div class="popup">';
        _html += '<div class="titleWrap">';
        _html += '<p class="title">'+ p_title +'</p><button class="closeBtn"><span>닫기</span></button></div>';
        _html += '<div class="contWrap filterWrap">';
        _html += '    <ul>';
        for (var i = 0; i < p_number; i++) {
            _html += '        <li>';
            _html += '            <div class="tit"><span>타이틀을입력하세요.</span></div>';
            _html += '             <div class="cont">필터/프로퍼티들어올자리입니다.</div>\n';
            _html += '         </li>\n';
        }
        _html += '    </ul>';
        _html += '</div>';
        _html += '<div class="info"><span class="popW">Width :</span><span class="popW_txt">'+ p_width +'</span><span class="popH">Height :</span><span class="popH_txt">'+ p_height +'</span><button type="button" class="codeSave btn-primary animate-down-2">저장하기</button></div>';
        _html += '</div>';

    $(".popup").draggable({
        "cancel": ".popup .contWrap",
        containment: ".preview",
        scroll: false
    });
    // 차트 리사이즈 처리
    $(".popup").resizable({
        minHeight: 350,
        resize: function() {
        //리사이즈 이벤트
        }
    });
    document.querySelector('.popup .closeBtn').addEventListener('click', function() {
        document.querySelector('.preview').classList.remove('show');
    });
    document.querySelector('.popup .codeSave').addEventListener('click', function() {
        document.querySelector('.puWInput').value = document.querySelector('.popup .popW_txt').textContent;
        document.documentElement.style.setProperty('--popup-width', document.querySelector('.popup .popW_txt').textContent);
        document.querySelector('.puHInput').value = document.querySelector('.popup .popH_txt').textContent;
        document.documentElement.style.setProperty('--popup-height', document.querySelector('.popup .popH_txt').textContent);
    });
});

document.querySelector('.editorBtn').addEventListener('click', function() {
    const diff = document.querySelectorAll(".preview .popup .filterWrap");
    if (diff.length > 0) {
        document.querySelector('.preview .popup').remove();
    }
    var p_title = document.querySelector('.titleInput').value;
    var p_width = document.querySelector('.puWInput').value;
    var p_height = document.querySelector('.puHInput').value;
    var p_top = document.querySelector('.puTInput').value;
    var p_left = document.querySelector('.puLInput').value;

    if(p_title == ''){ p_title = '타이틀을 입력하세요' ;}
    if(p_width == ''){ p_width = '700px' ;}
    if(p_height == ''){ p_height = '500px' ;}
    if(p_top == ''){ p_top = '0px' ;}
    if(p_left == ''){ p_left = '0px' ;}
    const htmlElements = document.querySelectorAll(".preview .popup .ck-content");
    if (htmlElements.length > 0) {
        document.querySelector('.popup .title').textContent = p_title;
        document.querySelector('.preview').classList.add('show');
    }else{
        var _html = '';
            _html += '<div class="popup">';
            _html += '<div class="titleWrap">';
            _html += '<p class="title">'+ p_title +'</p><button class="closeBtn"><span>닫기</span></button></div>';
            _html += '<div class="contWrap ck-content">';
            _html += '    <div class="editWrap">';
            _html += '        <textarea name="content" id="editor" class="edit"></textarea>';
            _html += '    </div>';
            _html += '</div>';
            _html += '<div class="info"><span class="popW">Width :</span><span class="popW_txt">'+ p_width +'</span><span class="popH">Height :</span><span class="popH_txt">'+ p_height +'</span><button type="button" class="codeSave btn-primary animate-down-2">저장하기</button></div>';
            _html += '</div>';

        document.querySelector('.preview').innerHTML = _html;
        document.querySelector('.preview').classList.add('show');

        //edit
        editerFn();
        
        // 차트 드래그 가능 처리
        $(".popup").draggable({
            "cancel": ".popup .contWrap",
            containment: ".preview",
            scroll: false
        });
        // 차트 리사이즈 처리
        $(".popup").resizable({
            minHeight: 350,
            resize: function() {
            //리사이즈 이벤트
            }
        });
    }
    document.querySelector('.popup .closeBtn').addEventListener('click', function() {
        document.querySelector('.preview').classList.remove('show');
    });
    document.querySelector('.popup .codeSave').addEventListener('click', function() {
        document.querySelector('.puWInput').value = document.querySelector('.popup .popW_txt').textContent;
        document.documentElement.style.setProperty('--popup-width', document.querySelector('.popup .popW_txt').textContent);
        document.querySelector('.puHInput').value = document.querySelector('.popup .popH_txt').textContent;
        document.documentElement.style.setProperty('--popup-height', document.querySelector('.popup .popH_txt').textContent);
    });
});

function editerFn(){
    ClassicEditor
        .create( document.querySelector( '#editor' ) ,{
            removePlugins: ["MediaEmbedToolbar"],
            mediaEmbed: {
                previewsInData:true,
                removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
            },
            codeBlock: {
                languages: [
                    { language: 'html', label: 'HTML' },
                    { language: 'css', label: 'CSS' },
                    { language: 'javascript', label: 'JavaScript', class: 'js javascript js-code' },
                    { language: 'python', label: 'Python' },
                    { language: 'xml', label: 'XML' }
                ]
            },
        })
        .then(editor => {
            document.querySelector('.popup .codeSave').addEventListener('click', function() {
                popContData = editor.getData();
                console.log(popContData);
            });
        })
        .catch(error => {
            console.error(error);
        });
}
