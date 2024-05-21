//import {jquery_ui, ckEdit_css}  from './lib.js';

var popContData = '';
var btnArea = 'text';
var contentValue = "edit";
var popDrag = false;
var popSize = false;

var jsChartType ='';
var jsChartOptions ='';
var jsChartDataSets = '';
var jsChartDataSetsLength = 0;
var jsTableType ='';
var jsTableDataSets = false;
var jsConlabel = false;
var jsValue = false;
var jsPercentage = false;

Coloris({
    el: '.coloris',
    swatches: [
      '#264653',
      '#2a9d8f',
      '#e9c46a',
      '#f4a261',
      '#e76f51',
      '#d62828',
      '#023e8a',
      '#0077b6',
      '#0096c7',
      '#00b4d8',
      '#48cae4'
    ]
});
  Coloris.setInstance('.instance2', { 
    theme: 'polaroid',
    formatToggle: true
});

// 함수 정의
function setInitialValues(id, value) {
    const element = document.getElementById(id);
    element.setAttribute('value', value);
    document.documentElement.style.setProperty('--' + element.name, value);
}

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
    var newValue = this.value + this.getAttribute('unit');
    document.documentElement.style.setProperty('--' + this.name, newValue);
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

const filterNum = document.querySelector('.filterNum');
const editorReview = document.querySelector('.editorBtnWrap');
const filterReview = document.querySelector('.previewBtnWrap');
const optionReview = document.querySelector('.optionBtnWrap');
const popHieghtInput = document.querySelector('.puHInput');
function handlePopupContentChange() {
    if (this.checked) {
        if (this.value === 'option1') {
            filterNum.style.display = 'none';
            editorReview.style.display = '';
            filterReview.style.display = 'none';
            optionReview.style.display = 'none';
            popHieghtInput.disabled = false;
            contentValue = "edit";
        } else if (this.value === 'option2') {
            filterNum.style.display = 'block';
            editorReview.style.display = 'none';
            filterReview.style.display = '';
            optionReview.style.display = 'none';
            popHieghtInput.disabled = false;
            contentValue = "filter";
        } else {
            filterNum.style.display = 'none';
            editorReview.style.display = 'none';
            filterReview.style.display = 'none';
            optionReview.style.display = '';
            popHieghtInput.disabled = true;
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
        document.querySelectorAll('.copy').forEach(function(element) {
            element.classList.remove('ok');
        });
        document.querySelectorAll('.accordion-panel-header').forEach(function(element) {
            removeAllClasses('.accordion-panel-header', 'on');
            removeAllClasses('.accordion .collapse', 'show');
        });
    });
});

document.querySelectorAll('.copy').forEach(function(element) {
    element.addEventListener('click', copyCodeToClipboard);
});

document.querySelectorAll('.opt input').forEach(function(input) {
    input.addEventListener('change', handleInputValueUpdate);
});

// 초기값 설정
//setInitialValues('popupBGColor', init.popup_bg);
//setInitialValues('titleBGColor', init.title_bg);
//setInitialValues('titleTxtColor', init.title_txt);
//setInitialValues('btnTxtColor', init.btn_txt);
//setInitialValues('btnBGColor', init.btn_bg);

const radioButtons = document.querySelectorAll('.radioChk input[type="radio"]');
const btnPosition = document.querySelector('.btnPosition');
const chartID = document.querySelector('.chartID');

radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', handleRadioButtonChange);
});

const popConts = document.querySelectorAll('.popupCon input[type="radio"]');

popConts.forEach(function(popCont) {
    popCont.addEventListener('change', handlePopupContentChange);
});

const checkBoxs = document.querySelectorAll('.custom-control-input');
checkBoxs.forEach(function(checkbox) {
    checkbox.addEventListener('change', handleCheckboxChange);
});


// Javascript Chart Option Start ================================//
//===============================================================//

// chart select function ========================================//
const chartButtons = document.querySelectorAll('.selectWrap');
const chartWraps = document.querySelectorAll('.chartWrap');

chartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedChart = button.getAttribute('chartName');
        updateVisibility(selectedChart);
        toggleActiveButton(button);
    });
});

function toggleActiveButton(clickedButton) {
    chartButtons.forEach(button => {
        button.classList.remove('on');
    });
    clickedButton.classList.add('on');
}

function updateVisibility(selectedChart) {
    chartWraps.forEach(wrap => {
        wrap.style.display = 'none';
    });
    const selectedWrap = document.querySelector(`.${selectedChart}ChartWrap`);
    if (selectedWrap) {
        selectedWrap.style.display = 'block';
    }
}
// chart select function end========================================//

// chart datasets function =========================================//
function initializeCharts() {
    ['barChartWrap', 'lineChartWrap', 'doughnutChartWrap', 'polarAreaChartWrap', 'radarChartWrap', 'tableChartWrap'].forEach(chartType => {
        initializeChart(chartType);
    });
}

function initializeChart(chartType) {
    const chartWrap = document.querySelector(`.${chartType}`);
    const addDataSetButton = chartWrap.querySelector('.addDataSet');
    const dataSetsWrap = chartWrap.querySelector('.dataSetsWrap');

    addDataSetButton.addEventListener('click', () => addDataSet(chartType));
    dataSetsWrap.addEventListener('click', (event) => {
        if (event.target.classList.contains('removeDataSet')) {
            handleRemoveDataSet(event, chartType);
        } else {
            handleDataSetMenuClick(event);
        }
    });
}

function addDataSet(chartType) {
    const chartWrap = document.querySelector(`.${chartType}`);
    const lastDataSet = chartWrap.querySelector('.dataSetsWrap > div:last-child');
    const clonedDataSet = lastDataSet.cloneNode(true);
    let dataSetCount = updateDataSetCount(chartType);

    dataSetCount++;
    clonedDataSet.classList.replace(clonedDataSet.classList[clonedDataSet.classList.length - 1], `dataSets${dataSetCount}`);

    const lastInput = lastDataSet.querySelector('.barDataInput, .lineDataInput, .radarDataInput'); 
    const inputType = lastInput.classList.contains('barDataInput') ? 'barData' : lastInput.classList.contains('lineDataInput') ? 'lineData' : 'radarData';
    const newInputId = `${inputType}${dataSetCount}`;
    clonedDataSet.querySelector('.barDataInput, .lineDataInput, .radarDataInput').id = newInputId; 
    clonedDataSet.querySelector('.barDataInput, .lineDataInput, .radarDataInput').value = '';


    clonedDataSet.querySelector('.categoryName').value = '';
    clonedDataSet.querySelector('.chartColor').value = '';
    if(clonedDataSet.querySelector('.chartBorderColor')){
        clonedDataSet.querySelector('.chartBorderColor').value = '';
    }
    if(clonedDataSet.querySelector('.chartPointColor')){
        clonedDataSet.querySelector('.chartPointColor').value = '';
    }

    resetMenuAndDisplay(clonedDataSet);

    chartWrap.querySelector('.dataSetsWrap').appendChild(clonedDataSet);
}
function resetMenuAndDisplay(dataSet) {
    const firstButton = dataSet.querySelector('.dataSetsMenu li:first-child button');
    const allButtons = dataSet.querySelectorAll('.dataSetsMenu li button');
    allButtons.forEach(btn => btn.parentElement.classList.remove('on'));
    firstButton.parentElement.classList.add('on');

    const dataDiv = dataSet.querySelector('.dataSets_data');
    const optionsDiv = dataSet.querySelector('.dataSets_option');
    dataDiv.style.display = 'block';
    optionsDiv.style.display = 'none';
}

function handleRemoveDataSet(event, chartType) {
    const dataSet = event.target.closest('.dataWrap');
    if (updateDataSetCount(chartType) === 1) {
        const removeInfo = dataSet.querySelector('.removeInfo');
        removeInfo.textContent = "더 이상 삭제할 수 없습니다.";
        setTimeout(() => {
            removeInfo.textContent = "";
        }, 1000);
    } else {
        dataSet.remove();
        reassignDataSetClasses(chartType);
    }
}
function updateDataSetCount(chartType) {
    return document.querySelector(`.${chartType} .dataSetsWrap`).children.length;
}

function reassignDataSetClasses(chartType) {
    const dataSets = document.querySelectorAll(`.${chartType} .dataSetsWrap > div`);
    dataSets.forEach((element, index) => {
        const lastClassIndex = element.classList.length - 1;
        element.classList.replace(element.classList[lastClassIndex], `dataSets${index + 1}`);
    });
}

function handleDataSetMenuClick(event) {
    const target = event.target;
    if (target.tagName !== 'BUTTON' || !target.closest('.dataSetsMenu')) return;
    
    const allLi = target.closest('ul').children;
    Array.from(allLi).forEach(li => li.classList.remove('on'));
    target.parentElement.classList.add('on');

    const dataSet = target.closest('.dataWrap');
    const sections = dataSet.querySelectorAll('.dataSets_data, .dataSets_option');
    sections.forEach(sec => sec.style.display = 'none');
    sections[Array.from(allLi).indexOf(target.parentElement)].style.display = 'block';
}
initializeCharts();

// chart datasets function end=========================================//

// chart options function =========================================//
function initializeOptionMenus() {
    ['barChartWrap', 'lineChartWrap', 'doughnutChartWrap', 'polarAreaChartWrap', 'radarChartWrap'].forEach(chartType => {
        initializeOptionMenu(chartType);
    });
}

function initializeOptionMenu(chartType) {
    const chartWrap = document.querySelector(`.${chartType}`);
    const optionsClick = chartWrap.querySelectorAll('.optionsMenu button');
    const optionsDiv = chartWrap.querySelectorAll('.option_common, .option_chart, .option_label, .option_legend, .option_tooltip');

    optionsClick.forEach((button, index) => {
        button.addEventListener('click', () => {
            handleOptionsMenuClick(optionsClick, optionsDiv, index);
        });
    });
}

function handleOptionsMenuClick(optionsClick, optionsDiv, index){
    optionsClick.forEach((btn, idx) => {
        if (idx === index) {
            btn.parentElement.classList.add('on');
        } else {
            btn.parentElement.classList.remove('on');
        }
    });
    optionsDiv.forEach((div, idx) => {
        if (idx === index) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}

initializeOptionMenus();
// chart options function end=========================================//
// chart type return function ========================================//
function getSelectedChartType() {
    const selectedButton = document.querySelector('.selectWrap.on');
    if (selectedButton) {
        return selectedButton.getAttribute('chartName');
    }
    return null;
}
// chart type return function end========================================//


document.querySelector('.prevChart').addEventListener('click', function() {
    const chartType = getSelectedChartType();
    const tablePreviewWrap = document.querySelector('.tablePreviewWrap');
    const chartPreviewWrap = document.querySelector('.chartPreviewWrap');
    if (chartType === 'table') {
        tablePreviewWrap.style.display = 'block';
        chartPreviewWrap.style.display = 'none';
        if (window.prevChart) {
            window.prevChart.destroy();
            delete window.prevChart;
        }
        createTable();
        showPopupChart();
    } else {
        const chartData = prepareChartData();
        if (tablePreviewWrap.firstChild) {
            tablePreviewWrap.removeChild(tablePreviewWrap.firstChild);
            tablePreviewWrap.style.display = 'none';
            chartPreviewWrap.style.display = 'block';
        }
        updateOrCreateChart(chartData);
        showPopupChart();
    }
});

// 차트 데이터 준비
function prepareChartData() {
    const labels = collectLabels();
    const datasets = collectDatasets();
    const chartType = getSelectedChartType();
    const userOptions = collectUserOptions();
    userOptions.type = chartType;
    const finalOptions = generateChartOptions(userOptions);
    return { labels, datasets, finalOptions };
}

// 레이블 수집
function collectLabels() {
    const chartType = getSelectedChartType();
    let labelDataInput;

    if (chartType === 'bar') {
        labelDataInput = document.getElementById('barLabelData');
    } else if (chartType === 'line') {
        labelDataInput = document.getElementById('lineLabelData'); 
    } else if (chartType === 'doughnut') {
        labelDataInput = document.getElementById('doughnutLabelData'); 
    } else if (chartType === 'polarArea') {
        labelDataInput = document.getElementById('polarAreaLabelData'); 
    } else if (chartType === 'radar') {
        labelDataInput = document.getElementById('radarLabelData'); 
    }

    return labelDataInput ? labelDataInput.value.split(/,\s*/) : [];
}

// 데이터셋 수집
function collectDatasets() {
    const chartType = getSelectedChartType();
    let containerSelector = '';
    if (chartType === 'bar') {
        containerSelector = '.barChartWrap';
    } else if (chartType === 'line') {
        containerSelector = '.lineChartWrap';
    } else if (chartType === 'doughnut') {
        containerSelector = '.doughnutChartWrap';
    } else if (chartType === 'polarArea') {
        containerSelector = '.polarAreaChartWrap';
    } else if (chartType === 'radar') {
        containerSelector = '.radarChartWrap';
    } else {
        return []; 
    }
    // 스태킹 설정 확인
    const isStacked = (chartType === 'bar' && document.querySelector('.stacked-bar').value === 'true');

    let datasets = Array.from(document.querySelectorAll(`${containerSelector} .dataWrap`)).map(dataWrap => {

        let dataset = {
            label: dataWrap.querySelector('.categoryName')?.value,
            data: [],
            backgroundColor: dataWrap.querySelector('.chartColor')?.value
        };

        const dataInput = dataWrap.querySelector('.barDataInput, .lineDataInput, .doughnutDataInput, .polarAreaDataInput, .radarDataInput'); 
        if (dataInput) {
        dataset.data = dataInput.value.split(/,\s*/).map(value => value === "" ? null : Number(value));
        }

        if (chartType === 'line') {
            dataset.borderColor = dataset.backgroundColor;
            dataset.borderDash = dataWrap.querySelector('.lineStyleSelect')?.value.split(',').map(Number);
            if(dataWrap.querySelector('.chartPointColor').value){
                dataset.pointBackgroundColor = dataWrap.querySelector('.chartPointColor')?.value;
            }
            dataset.usePointStyle = true;
            dataset.pointStyle = dataWrap.querySelector('.markerStyleSelect')?.value;
            delete dataset.backgroundColor; 
        }else if(chartType === 'doughnut'){
            var selectElement = dataWrap.querySelector('.doughnut-color-theme');
            var selectedValue = selectElement ? selectElement.value : null;
            if (selectedValue === "null") {
                dataset.backgroundColor = null;
            } else {
                dataset.backgroundColor = selectedValue.split(',').map(String);
            }
            dataset.hoverOffset = 8;
        }else if(chartType === 'polarArea'){
            var selectElement = dataWrap.querySelector('.polarArea-color-theme');
            var selectedValue = selectElement ? selectElement.value : null;
            if (selectedValue === "null") {
                dataset.backgroundColor = null;
            } else {
                dataset.backgroundColor = selectedValue.split(',').map(String);
            }
            dataset.hoverOffset = 8;
        }else if(chartType === 'radar'){
            dataset.fill = dataWrap.querySelector('.radarAreaFillSelect').value === 'true';
            if(dataWrap.querySelector('.chartBorderColor').value){
                dataset.borderColor = dataWrap.querySelector('.chartBorderColor')?.value;
            }
            dataset.borderDash = dataWrap.querySelector('.radarLineStyleSelect')?.value.split(',').map(Number);
            if(dataWrap.querySelector('.chartPointColor').value){
                dataset.pointBackgroundColor = dataWrap.querySelector('.chartPointColor')?.value;
            }
            dataset.usePointStyle = true;
            dataset.pointStyle = dataWrap.querySelector('.radarMarkerStyleSelect')?.value;
            //delete dataset.backgroundColor; 
        }

        // 축 ID 설정
        const chartAxisSelect = dataWrap.querySelector('.chartAxisSelect');
        if (chartAxisSelect && chartAxisSelect.value) {
            dataset.yAxisID = isStacked ? 'y1' : chartAxisSelect.value;  // 스태킹 활성화 시 강제로 'y1' 설정
        }

        return dataset;
    }).filter(dataset => dataset.label && dataset.data.length > 0);

    const maxLength = Math.max(...datasets.map(ds => ds.data.length));
    datasets.forEach(ds => {
        while (ds.data.length < maxLength) {
            ds.data.push(null);
        }
    });

    return datasets;
}

function collectUserOptions() {
    const chartType = getSelectedChartType();
    const options = {};
    const chartContainer = document.querySelector(`.${chartType}ChartWrap`); 
    
    // 공통 옵션 설정
    const commonSettings = [
        { selector: '.label-check', optionName: 'plugins.datalabels.display', transform: v => v === 'true' },
        { selector: '.label-position', optionName: 'plugins.datalabels.anchor', transform: v => v },
        { 
            selector: '.label-position', 
            optionName: 'plugins.datalabels.align', 
            transform: (v, chartType) => chartType === 'polarArea' ? (v === 'center' ? 'end' : v) : v 
        },
        { selector: '.legend-check', optionName: 'plugins.legend.display', transform: v => v === 'true' },
        { selector: '.legend-position', optionName: 'plugins.legend.position', transform: v => v },
        { selector: '.legend-style', optionName: 'plugins.legend.labels.pointStyle', transform: v => v },
        { selector: '.tooltip-check', optionName: 'plugins.tooltip.enabled', transform: v => v === 'true' },
        { selector: '.label-font-size', optionName: 'plugins.datalabels.font.size', transform: v => parseFloat(v) },
        { selector: '.label-font-color', optionName: 'plugins.datalabels.color', transform: v => v },
        { selector: '.legend-font-size', optionName: 'plugins.legend.labels.font.size', transform: v => parseFloat(v) },
        { selector: '.legend-font-color', optionName: 'plugins.legend.labels.color', transform: v => v },
        { selector: '.tooltip-bg-color', optionName: 'plugins.tooltip.backgroundColor', transform: v => v },
        { selector: '.tooltip-title-color', optionName: 'plugins.tooltip.titleColor', transform: v => v },
        { selector: '.tooltip-content-color', optionName: 'plugins.tooltip.bodyColor', transform: v => v },
        { selector: '.common-bg-color', optionName: 'plugins.customCanvasBackgroundColor.color', transform: v => v }
    ];

    commonSettings.forEach(({ selector, optionName, transform }) => {
        const element = chartContainer.querySelector(selector);
        if (element) {
            setOptionValue(options, optionName, transform(element.value, chartType));
        }
    });
    
    let isStacked = false;
    if (chartType === 'bar') {
        const stackedElement = chartContainer.querySelector('.stacked-bar');
        isStacked = stackedElement && stackedElement.value === 'true';
    }
    // 축 별 그리드 설정 상태 수집
    const gridSettings = { y1: false, y2: false };
    const axisUsed = { y1: false, y2: false }; // 각 축이 사용되는지 여부를 추적

    chartContainer.querySelectorAll('.dataWrap').forEach(dataWrap => {
        const chartAxisSelect = dataWrap.querySelector('.chartAxisSelect');
        const axisLineSelect = dataWrap.querySelector('.axisLineSelect');

        if (chartAxisSelect && chartAxisSelect.value) {
            let axis = chartAxisSelect.value;

            // 스태킹 활성화 시 y2 축이 선택되었다면 y1로 변경
            if (isStacked && axis === 'y2') {
                axis = 'y1'; // 축을 y1으로 강제 변경
            }

            // 축 사용 표시
            axisUsed[axis] = true;

            // 그리드 설정 검토
            if (axisLineSelect && axisLineSelect.value === 'true') {
                gridSettings[axis] = true; // 해당 축에 대해 그리드가 true인 경우 기록
            }
        }
    });

    // 실제 사용되는 축에 대해서만 설정 적용
    Object.keys(axisUsed).forEach(axis => {
        if (axisUsed[axis]) { // 축이 사용되는 경우에만
            const position = axis === 'y2' ? 'right' : 'left';
            setOptionValue(options, `scales.${axis}.position`, position);
            setOptionValue(options, `scales.${axis}.grid.display`, gridSettings[axis]); // 수집된 그리드 설정 적용
        }
    });

    // 모든 데이터셋에서 사용하는 축 확인
    const allY2 = Array.from(chartContainer.querySelectorAll('.chartAxisSelect')).every(select => select.value === 'y2');
    const anyY2 = Array.from(chartContainer.querySelectorAll('.chartAxisSelect')).some(select => select.value === 'y2');
    // 글꼴 크기 입력 처리
    const fontSizeInput = chartContainer.querySelector('.common-font-size');
    if (fontSizeInput && fontSizeInput.value) {
        const fontSize = parseFloat(fontSizeInput.value);
        setOptionValue(options, 'scales.x.ticks.font.size', fontSize);
        setOptionValue(options, 'scales.y1.ticks.font.size', fontSize);
        // 모든 데이터셋이 y2 축을 사용하면 y1 축을 숨김
        if (allY2) {
            setOptionValue(options, 'scales.y1.display', false);
        } else {
            setOptionValue(options, 'scales.y1.ticks.font.size', fontSize);
            setOptionValue(options, 'scales.y1.display', true);
        }
        // 스태킹 활성화되지 않았을 때만 y2 축 설정
        if (!isStacked) {
            const y2AxisSelected = Array.from(chartContainer.querySelectorAll('.chartAxisSelect')).some(select => select.value === 'y2');
            if (y2AxisSelected) {
                setOptionValue(options, 'scales.y2.ticks.font.size', fontSize);
            }
        }else{
            if (allY2) {
                setOptionValue(options, 'scales.y1.position', "right");
                setOptionValue(options, 'scales.y1.display', true);
            }
        }
    }
    
    // 차트 유형별 옵션 설정
    collectChartSpecificOptions(options, chartContainer, chartType);

    return options;
}

function collectChartSpecificOptions(options, chartContainer, chartType) {
    if (chartType === 'bar') {
        const barSettings = [
            { selector: '.bar-logic', optionName: 'indexAxis', transform: v => v },
            { selector: '.stacked-bar', optionName: 'scales.x.stacked', transform: v => v === 'true' },
            { selector: '.stacked-bar', optionName: 'scales.y1.stacked', transform: v => v === 'true' },
            { selector: '.bar-width', optionName: 'scales.x.barPercentage', transform: v => parseFloat(v) / 100 },
            { selector: '.bar-border-radius', optionName: 'borderRadius', transform: v => parseFloat(v) }
        ];
        barSettings.forEach(({ selector, optionName, transform }) => {
            const element = chartContainer.querySelector(selector);
            if (element) {
                setOptionValue(options, optionName, transform(element.value));
            }
        });
    } else if (chartType === 'line') {
        const lineOptions = [
            { selector: '.line-border-width', optionName: 'borderWidth', transform: v => parseFloat(v) },
            { selector: '.line-point-size', optionName: 'pointRadius', transform: v => parseFloat(v) },
            { selector: '.line-tension', optionName: 'tension', transform: v => parseFloat(v) },
            { selector: '.line-stepped', optionName: 'stepped', transform: v => v === 'true' }
        ];
        lineOptions.forEach(({ selector, optionName, transform }) => {
            const element = chartContainer.querySelector(selector);
            if (element) {
                setOptionValue(options, optionName, transform(element.value));
            }
        });
    } else if (chartType === 'doughnut') {
        const doughnutOptions = [
            { selector: '.doughnut-cutout-size', optionName: 'cutout', transform: v => v +'%' }
        ];
        doughnutOptions.forEach(({ selector, optionName, transform }) => {
            const element = chartContainer.querySelector(selector);
            if (element) {
                setOptionValue(options, optionName, transform(element.value));
            }
        });
    } else if (chartType === 'polarArea') {
        const doughnutOptions = [
            { selector: '.polarArea-circular', optionName: 'circular', transform: v => v === 'true' },
            { selector: '.polarArea-axis-show', optionName: 'scales.r.pointLabels.display', transform: v => v === 'true' },
            { selector: '.polarArea-pointLabels-font-size', optionName: 'scales.r.pointLabels.font.size', transform: v => parseFloat(v) }
        ];
        doughnutOptions.forEach(({ selector, optionName, transform }) => {
            const element = chartContainer.querySelector(selector);
            if (element) {
                setOptionValue(options, optionName, transform(element.value));
            }
        });
    } else if (chartType === 'radar') {
        const radarOptions = [
            { selector: '.radar-axis-show', optionName: 'scales.r.pointLabels.display', transform: v => v === 'true' },
            { selector: '.radar-suggested-min', optionName: 'scales.r.suggestedMin', transform: v => v.trim() === '' ? null : parseFloat(v) },
            { selector: '.radar-suggested-max', optionName: 'scales.r.suggestedMax', transform: v => v.trim() === '' ? null : parseFloat(v) },
            { selector: '.radar-border-width', optionName: 'borderWidth', transform: v => parseFloat(v) },
            { selector: '.radar-point-size', optionName: 'pointRadius', transform: v => parseFloat(v) },
            { selector: '.radar-tension', optionName: 'tension', transform: v => parseFloat(v) },
            { selector: '.radar-pointLabels-font-size', optionName: 'scales.r.pointLabels.font.size', transform: v => parseFloat(v) },
            { selector: '.radar-range-label-check', optionName: 'scales.r.ticks.display', transform: v => v === 'true' }
        ];
        radarOptions.forEach(({ selector, optionName, transform }) => {
            const element = chartContainer.querySelector(selector);
            if (element) {
                setOptionValue(options, optionName, transform(element.value));
            }
        });
    }
}

function setOptionValue(options, path, value) {
    const keys = path.split('.');
    let current = options;
    for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
            current[keys[i]] = value;
        } else {
            current[keys[i]] = current[keys[i]] || {};
            current = current[keys[i]];
        }
    }
}

function deepMerge(target, source) {
    if (typeof source !== 'object' || source === null) {
        return source;
    }
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const value = source[key];
            if (typeof value !== 'object' || value === null) {
                target[key] = value;
            } else {
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
    let defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        spanGaps: false,
        layout: { padding: { top: 5, bottom: 15, left: 15, right: 15 } },
        plugins: {
            legend: { display: true, position: "top", labels: { usePointStyle: true, pointStyle: 'circle' } },
            datalabels: { 
                display: "auto", 
                formatter: function(value,context){
                    return value;
                },
                anchor: 'center', 
                align: 'center', 
                font: { size: 12 }
            }
        }
    };
    let trackedOptions = JSON.parse(JSON.stringify(defaultOptions));

    // 차트 유형에 따라 다른 설정을 적용합니다.
    if (userOptions.type === 'bar') {
        trackedOptions = Object.assign(trackedOptions, {
            barPercentage: 0.9,
            borderRadius: 3,
            scales: {
                x: { position: "bottom", offset : true, grid: { display: true } },
                y1: { position: "left", grid: { display: false } }
            }
        });
    } else if (userOptions.type === 'line') {
        trackedOptions = Object.assign(trackedOptions, {
            tension: 0,
            borderWidth: 3,
            pointRadius: 4,
            stepped: false,
            scales: {
                x: { position: "bottom", offset : true, grid: { display: true } },
                y1: { position: "left", grid: { display: false } }
            }
        });
    } else if (userOptions.type === 'doughnut') {
        jsConlabel = document.getElementById('doughnut-label-info-check').checked;
        jsValue = document.getElementById('doughnut-value-info-check').checked;
        jsPercentage = document.getElementById('doughnut-percent-info-check').checked;

        trackedOptions = Object.assign(trackedOptions, {
            plugins: {
                legend: { display: true, position: "top", labels: { usePointStyle: true, pointStyle: 'circle' } },
                datalabels: { 
                    formatter: function (value, context) {
                        var idx = context.dataIndex;
                        var conlabel = context.chart.data.labels[idx];
                        var sum = context.dataset.data.reduce((a, b) => a + b, 0);
                        var percentage = ((value / sum) * 100).toFixed(2) + "%";
                        var val = value;
                        var result = "";
                        var conlabelTF = document.getElementById('doughnut-label-info-check').checked;
                        var valueTF = document.getElementById('doughnut-value-info-check').checked;
                        var percentageTF = document.getElementById('doughnut-percent-info-check').checked;
                        function showInLabel(conlabelTF, valueTF, percentageTF) {
                            if (conlabelTF) {
                                result += conlabel;
                            }
                            if (valueTF) {
                                if (result !== "") result += ", ";
                                result += val;
                            }
                            if (percentageTF) {
                                if (result !== "") result += " (" + percentage + ")";
                                else result += percentage;
                            }
                            return result
                        }
                        return showInLabel(conlabelTF, valueTF, percentageTF)
                    },
                    anchor: 'center', 
                    align: 'end', 
                    font: { size: 12 }
                }
            }
        });
    } else if (userOptions.type === 'polarArea') {
        jsConlabel = document.getElementById('polarArea-label-info-check').checked;
        jsValue = document.getElementById('polarArea-value-info-check').checked;
        jsPercentage = document.getElementById('polarArea-percent-info-check').checked;

        trackedOptions = Object.assign(trackedOptions, {
            scales: {
                r: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        font: {
                            size: 14,
                        }
                    }
                }
            },
            plugins: {
                legend: { display: true, position: "top", labels: { usePointStyle: true, pointStyle: 'circle' } },
                datalabels: { 
                    formatter: function (value, context) {
                        var idx = context.dataIndex;
                        var conlabel = context.chart.data.labels[idx];
                        var sum = context.dataset.data.reduce((a, b) => a + b, 0);
                        var percentage = ((value / sum) * 100).toFixed(2) + "%";
                        var val = value;
                        var result = "";
                        var conlabelTF = document.getElementById('polarArea-label-info-check').checked;
                        var valueTF = document.getElementById('polarArea-value-info-check').checked;
                        var percentageTF = document.getElementById('polarArea-percent-info-check').checked;
                        function showInLabel(conlabelTF, valueTF, percentageTF) {
                            if (conlabelTF) {
                                result += conlabel;
                            }
                            if (valueTF) {
                                if (result !== "") result += ", ";
                                result += val;
                            }
                            if (percentageTF) {
                                if (result !== "") result += " (" + percentage + ")";
                                else result += percentage;
                            }
                            return result
                        }
                        return showInLabel(conlabelTF, valueTF, percentageTF)
                    },
                    anchor: 'center', 
                    align: 'end', 
                    font: { size: 12 }
                }
            }
        });
    } else if (userOptions.type === 'radar') {
        jsConlabel = document.getElementById('radar-label-info-check').checked;
        jsValue = document.getElementById('radar-value-info-check').checked;
        jsPercentage = document.getElementById('radar-percent-info-check').checked;

        trackedOptions = Object.assign(trackedOptions, {
            scales: {
                r: {
                    angleLines: {
                        display: true, 
                    },
                    ticks:{
                        color: '#999'
                    },
                    pointLabels: {
                        display: true,
                        font: {
                            size: 14,
                        }
                    },
                    suggestedMin:null,
                    suggestedMax:null
                }
            },
            plugins: {
                legend: { display: true, position: "top", labels: { usePointStyle: true, pointStyle: 'circle' } },
                datalabels: { 
                    formatter: function (value, context) {
                        var idx = context.dataIndex;
                        var conlabel = context.chart.data.labels[idx];
                        var sum = context.dataset.data.reduce((a, b) => a + b, 0);
                        var percentage = ((value / sum) * 100).toFixed(2) + "%";
                        var val = value;
                        var result = "";
                        var conlabelTF = document.getElementById('radar-label-info-check').checked;
                        var valueTF = document.getElementById('radar-value-info-check').checked;
                        var percentageTF = document.getElementById('radar-percent-info-check').checked;
                        function showInLabel(conlabelTF, valueTF, percentageTF) {
                            if (conlabelTF) {
                                result += conlabel;
                            }
                            if (valueTF) {
                                if (result !== "") result += ", ";
                                result += val;
                            }
                            if (percentageTF) {
                                if (result !== "") result += " (" + percentage + ")";
                                else result += percentage;
                            }
                            return result
                        }
                        return showInLabel(conlabelTF, valueTF, percentageTF)
                    },
                    anchor: 'center', 
                    align: 'end', 
                    font: { size: 12 }
                }
            }
        });
    }
    // 사용자 옵션을 병합
    const mergedOptions = deepMerge(trackedOptions, userOptions);

    // 옵션 저장하기
    jsChartOptions = JSON.stringify(trackedOptions);
    //console.log("Tracked options:", jsChartOptions);
    return mergedOptions;
}

// 차트 생성 또는 업데이트
function updateOrCreateChart({ labels, datasets, finalOptions }) {
    //console.log(datasets);
    console.log(jsChartDataSets);
    console.log(jsChartOptions);
    const ctx = document.getElementById('chartPreview').getContext('2d');
    const chartType = getSelectedChartType();
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
    const customLegendSpacing = {
        id: 'customLegendSpacing',
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function fit() {
                originalFit.bind(chart.legend)();
                if (this.options.position === 'top') {
                    this.height += 15; 
                }
            };
        }
    };

    // 이전 차트가 존재하는 경우
    if (window.prevChart) {
        // 이전 차트의 타입이 현재 선택된 차트와 같은지 확인.
        if (window.prevChart.config.type === chartType) {
            // 같은 타입의 차트이므로 업데이트.
            updateChart(window.prevChart, chartType, labels, datasets, finalOptions);
        } else {
            // 다른 타입의 차트이므로 이전 차트를 제거하고 새로운 차트를 생성.
            window.prevChart.destroy();
            delete window.prevChart;
            window.prevChart = createChart(ctx, chartType, labels, datasets, finalOptions, plugin, customLegendSpacing);
        }
    }else {
        window.prevChart = createChart(ctx, chartType, labels, datasets, finalOptions, plugin, customLegendSpacing);
    }
    
    const modifiedDatasets = datasets.map(dataset => {
        const { data, ...otherProps } = dataset; // 'data' 속성을 제외하고 나머지 속성을 복사
        return otherProps;
    });
    jsChartDataSetsLength = datasets.length;
    jsChartDataSets = JSON.stringify(modifiedDatasets);
    jsChartType = chartType;
    //jsChartOptions = JSON.stringify(finalOptions);
}
// 차트 생성
function createChart(ctx, type, labels, datasets, options, plugin, customLegendSpacing) {
    return new Chart(ctx, {
        type,
        data: { labels, datasets },
        options,
        plugins: [plugin, customLegendSpacing, ChartDataLabels] // 필요한 플러그인 추가
    });
}

function createTable() {
    const tableElement = document.getElementById('tableOption');
    applyTableStyles(tableElement);

    // 표를 생성합니다.
    const tableWrap = document.querySelector('.tablePreviewWrap');
    const table = document.createElement('table');
    table.classList.add('table');
    
    // 표를 꾸미는 코드 작성...
    const tableData = document.querySelector('.tableDataInput').value;
    const tableHeaderStyle = document.querySelector('.table-header-style').value;
    jsTableType = tableHeaderStyle;

    drawTableFromData(tableData, table, tableHeaderStyle);

    // 기존의 표가 있다면 삭제합니다.
    while (tableWrap.firstChild) {
        tableWrap.removeChild(tableWrap.firstChild);
    }
    // 새로운 표를 추가합니다.
    tableWrap.appendChild(table);
    jsChartType = getSelectedChartType();
}
/*
function drawTableFromData(data, table, headerStyle) {
    const rows = data.split('/');
    rows.forEach((row, rowIndex) => {
        const rowData = row.split(',');
        const tr = document.createElement('tr');
        rowData.forEach((cellData, cellIndex) => {
            const isFirstRow = rowIndex === 0;
            const isFirstCell = cellIndex === 0;
            const isHeaderRow = isFirstRow && headerStyle === 'Column';
            const isHeaderCell = headerStyle === 'Row' && isFirstCell;
            const element = isHeaderRow || isHeaderCell ? 'th' : 'td';
            const cell = document.createElement(element);
            cell.textContent = cellData;
            tr.appendChild(cell);
        });
        table.appendChild(tr);
    });
}
*/
function drawTableFromData(data, table, headerStyle) {
    if(data){
        jsTableDataSets = true;
    }
    const rows = data.split('/');
    const matrix = rows.map(row => row.split(/,\s*/));

    if (headerStyle === 'Row') {
        // 행 기반 헤더 처리: 데이터를 피벗합니다.
        for (let i = 0; i < matrix[0].length; i++) { // 첫 행의 길이만큼 반복
            const tr = document.createElement('tr');
            for (let j = 0; j < matrix.length; j++) { // 각 행을 반복
                const cell = document.createElement(j === 0 ? 'th' : 'td');
                cell.textContent = matrix[j][i];
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
    } else if (headerStyle === 'Column') {
        // 열 기반 헤더 처리: 기존 로직 사용
        matrix.forEach((rowData, rowIndex) => {
            const tr = document.createElement('tr');
            rowData.forEach((cellData, cellIndex) => {
                const cell = document.createElement(rowIndex === 0 ? 'th' : 'td');
                cell.textContent = cellData;
                tr.appendChild(cell);
            });
            table.appendChild(tr);
        });
    }
}


// table option 정의
function applyTableStyles(tableElement) {
    const inputs = tableElement.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
        var newValue = input.value + input.getAttribute('unit');
        document.documentElement.style.setProperty('--' + input.name, newValue);
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
// 팝업 창 크기 설정 함수
function setPopupSize(element, width, height) {
    element.style.width = width + "px";
    element.style.height = height + "px";
}

// 차트 팝업 표시
let currentChartType = null;

function showPopupChart() {
    const popChart = document.querySelector('.popChartWrap');
    const chartType = getSelectedChartType();
    const popupWidth = document.querySelector('.puWInput').value;
    let ratio = true;

    // 차트 타입이 변경되었거나 팝업창이 초기화되지 않은 경우 크기 설정
    if (chartType !== currentChartType || !popChart.dataset.initialized) {
        if (chartType === "doughnut" || chartType === "polarArea" || chartType === "radar") {
            setPopupSize(popChart, popupWidth, Number(popupWidth) + 35);
            ratio = true;
        } else if (chartType === "table") {
            setPopupSize(popChart, popupWidth, Number(popupWidth / 2) + 35);
            ratio = false;
        } else {
            setPopupSize(popChart, popupWidth, Number(popupWidth / 2) + 35);
            ratio = true;
        }

        // 드래그 및 리사이즈 초기화
        $(".popChartWrap").draggable({
            "cancel": ".popChartWrap .popChart",
            containment: ".chartOptionWrap",
            scroll: false
        });
        $(".popChartWrap").resizable({
            aspectRatio: ratio,
            resize: function() {
                // 리사이즈 이벤트
                // prevChart.resize();
            }
        });

        // 팝업창이 초기화되었음을 표시
        popChart.dataset.initialized = "true";
        // 현재 차트 타입 업데이트
        currentChartType = chartType;
    }

    // 팝업창 보이기
    popChart.style.display = 'block';
}

// tablePreview option
document.querySelectorAll('.tableChartWrap .dataSets_option input , .tableChartWrap .dataSets_option select').forEach(function(input) {
    input.addEventListener('change', handleInputValueUpdate);
});

// closeBtn 버튼 클릭 시 팝업 닫기
document.querySelector('.popChartWrap .closeBtn').addEventListener('click', function() {
    const popChartWrap = document.querySelector('.popChartWrap');
    popChartWrap.style.display = 'none';
    //popChartWrap.style.width = '';
    //popChartWrap.style.height = '';
    //popChartWrap.style.top = '';
    //popChartWrap.style.left = '';
});

document.querySelector('.optionSave').addEventListener('click', function() {
    const errorInfo = document.querySelector('.errorInfo');
    if(jsChartType == "table"){
        if(jsTableDataSets){
            document.body.classList.remove('modal-open');
            var modal = this.closest('.modal');
            modal.classList.remove('show');
            modal.removeAttribute('style');
            const popChartWrap = document.querySelector('.popChartWrap');
            popChartWrap.style.display = 'none';
            //popChartWrap.style.width = '';
            //popChartWrap.style.height = '';
            //popChartWrap.style.top = '';
            //popChartWrap.style.left = '';
        }else{
            errorInfo.textContent = "DataSets를 설정해 주세요.";
            setTimeout(() => {
                errorInfo.textContent = "";
            }, 1000);
        }
    }else{
        if(jsChartDataSets == ''){
            errorInfo.textContent = "차트 미리보기를 실행해 주세요.";
            setTimeout(() => {
                errorInfo.textContent = "";
            }, 1000);
        }else if(jsChartDataSets == '[]'){
            errorInfo.textContent = "DataSets를 설정해 주세요.";
            setTimeout(() => {
                errorInfo.textContent = "";
            }, 1000);
        }else{
            document.body.classList.remove('modal-open');
            var modal = this.closest('.modal');
            modal.classList.remove('show');
            modal.removeAttribute('style');
            const popChartWrap = document.querySelector('.popChartWrap');
            popChartWrap.style.display = 'none';
            //popChartWrap.style.width = '';
            //popChartWrap.style.height = '';
            //popChartWrap.style.top = '';
            //popChartWrap.style.left = '';
            //console.log(jsChartDataSets);
            //console.log(jsChartOptions);
        }
    }
    
    //console.log(jsChartType);
    console.log(jsChartDataSets);
    console.log(jsChartOptions);
    //console.log(jsChartDataSetsLength);
});

document.querySelector('.optionBtn').addEventListener('click', function() {
    document.body.classList.add('modal-open');
    var modal = document.querySelector('#modal-option');
        modal.style.display = 'block';
        modal.classList.add('show');
        modal.setAttribute('style', 'display:block; padding-right:16px');
});

document.querySelector('.resultBtn').addEventListener('click', function() {
    var p_title = getValue('.titleInput', '타이틀을 입력하세요');
    var p_width = getValueWithUnit('.puWInput', 'px', '800');
    if (contentValue == "chart") {
        if(jsChartType == 'table'){
            var p_height = getValueWithUnit('.puHInput', 'px', '400');
        }else if(jsChartType == 'bar' || jsChartType == 'line'){
            var p_height = document.querySelector('.puWInput').value / 2 + "px";
        }else{
            var p_height = p_width;
        }
    }else{
        var p_height = getValueWithUnit('.puHInput', 'px', '400');
    }
    
    var p_top = getValueWithUnit('.puTInput', 'px', '50');
    var p_left = getValueWithUnit('.puLInput', 'px', '50');
    var b_title = getValue('.btnTextInput', '팝업열기');
    var b_top = getValueWithUnit('.btnTop', 'px', '0');
    var b_left = getValueWithUnit('.btnLeft', 'px', '0');
    var c_id = getValue('.chartIDInput', '');
    var p_bg = document.querySelector('.popupBGColor').value;
    var b_color = document.querySelector('.btnTxtColor').value;
    var b_bg = document.querySelector('.btnBGColor').value;
    var p_title_bg = document.querySelector('.titleBGColor').value;
    var p_title_txt = document.querySelector('.titleTxtColor').value;
    var p_number = getValue('.filterInput', '');

    // table chart option
    var t_border_color = getValue('.table-border-color','#cccccc');
    var t_th_bg = getValue('.table-th-bg','#eeeeee');
    var t_th_color = getValue('.table-th-color','#000000');
    var t_th_font = getValueWithUnit('.table-th-fontSize', 'px', '15');
    var t_th_align = getValue('.table-th-align','left');
    var t_th_padding = getValue('.table-th-padding','10px 10px 10px 10px');
    var t_td_bg = getValue('.table-td-bg','#ffffff');
    var t_td_color = getValue('.table-td-color','#000000');
    var t_td_font = getValueWithUnit('.table-td-fontSize', 'px', '14');
    var t_td_align = getValue('.table-td-align','left');
    var t_td_padding = getValue('.table-td-padding','10px 10px 10px 10px');

    var modal = document.querySelector('#modal-result');
    modal.setAttribute('style', 'padding-right:16px');
    document.body.classList.add('modal-open');

    var _html = generateHTML(p_title, b_title, p_number);
    var _css = generateCSS(p_width, p_height, p_top, p_left, b_top, b_left, b_color, b_bg, p_bg, p_title_bg, p_title_txt,t_border_color,t_th_bg,t_th_color,t_th_font,t_th_align,t_th_padding,t_td_bg,t_td_color,t_td_font,t_td_align,t_td_padding);
    var _plugin = generatePlugin(popSize, popDrag);
    var _js = generateJS(b_title, btnArea, popSize, popDrag, c_id);
    
    modal.classList.add('show');

    document.querySelector('.htmlResult').textContent = _html + _css;
    if (_plugin == '') {
        document.querySelector('.jsPluginWrap').style.display = 'none';
    } else {
        document.querySelector('.jsPluginWrap').style.display = 'block';
        document.querySelector('.jsPlugin').textContent = _plugin;
    }
    document.querySelector('.jsResult').textContent = _js;
});

function getValue(selector, defaultValue) {
    var value = document.querySelector(selector).value;
    return value ? value : defaultValue;
}

function getValueWithUnit(selector, unit, defaultValue) {
    var value = getValue(selector, defaultValue);
    return value + unit;
}

function generateHTML(p_title, b_title, p_number) {
    var _html = '';
    if (btnArea == 'text') {
        _html += '<div class="btnWrap textArea"><button class="popOpen btn">' + b_title + '</button></div>\n';
    }
    if (contentValue == "chart") {
        _html += '<pre class="popupDataWrap" hidden>\n';
        if(jsChartType == 'table'){
            _html += '    <span class="popupDatasetsData"><!-- datasetsData Calculated Values Insert --></span>\n';
        }else{
            _html += '    <span class="popupLabelData"><!-- labelsData Calculated Values Insert --></span>\n';
            for(var n = 0; n < jsChartDataSetsLength; n++){
                _html += '    <span class="popupDatasetsData"><!-- datasetsData Calculated Values Insert --></span>\n';
            }
        }
        _html += '</pre>\n';
    }
    _html += '<div class="popup">\n';
    _html += '    <div class="titleWrap">\n';
    _html += '        <p class="title">' + p_title + '</p><button class="closeBtn"><span>닫기</span></button>\n';
    _html += '    </div>\n';
    if (contentValue == "edit") {
        if (popContData != '') {
            _html += '    <div class="contWrap ck-content">\n';
            _html += '        <div class="editWrap">\n';
            _html += '            ' + popContData + '\n';
            _html += '        </div>\n';
            _html += '    </div>\n';
        } else {
            _html += '    <div class="contWrap">\n\n';
            _html += '    </div>\n';
        }
    } else if (contentValue == "filter") {
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
    } else if (contentValue == "chart") {
        _html += '    <div class="contWrap popChartWrap">\n';
        if(jsChartType == 'table'){
            _html += '        <div class="jsTableWrap"></div>\n';
        }else{
            _html += '        <div class="jsChartWrap">\n';
            _html += '            <canvas id="popupChart"></canvas>\n';
            _html += '        </div>\n';
        }
        _html += '    </div>\n';
        
    }   
    _html += '</div>\n\n';
    return _html;
}

function generateCSS(p_width, p_height, p_top, p_left, b_top, b_left, b_color, b_bg, p_bg, p_title_bg, p_title_txt,t_border_color,t_th_bg,t_th_color,t_th_font,t_th_align,t_th_padding,t_td_bg,t_td_color,t_td_font,t_td_align,t_td_padding) {
    var _css = '';
    _css += '<style>\n';
    _css += ':root{\n';
    _css += '    --popup-width:' + p_width + ';\n';
    _css += '    --popup-height:' + p_height + ';\n';
    _css += '    --popup-position-top:' + p_top + ';\n';``
    _css += '    --popup-position-left:' + p_left + ';\n';
    _css += '    --btn-position-top:' + b_top + ';\n';
    _css += '    --btn-position-left:' + b_left + ';\n';
    _css += '    --pbtn-text-color:' + b_color + ';\n';
    _css += '    --pbtn-bg-color:' + b_bg + ';\n';
    _css += '    --popup-bg-color:' + p_bg + ';\n';
    _css += '    --title-bg-color:' + p_title_bg + ';\n';
    _css += '    --title-txt-color:' + p_title_txt + ';\n';
    if (contentValue == "chart") {
        if(jsChartType == 'table'){
            _css += '    --tableChart-border-color: ' + t_border_color + ';\n';
            _css += '    --tableChart-th-bg: ' + t_th_bg + ';\n';
            _css += '    --tableChart-th-color: ' + t_th_color + ';\n';
            _css += '    --tableChart-th-fontSize: ' + t_th_font + ';\n';
            _css += '    --tableChart-th-align: ' + t_th_align + ';\n';
            _css += '    --tableChart-th-padding: ' + t_th_padding + ';\n';
            _css += '    --tableChart-td-bg: ' + t_td_bg + ';\n';
            _css += '    --tableChart-td-color: ' + t_td_color + ';\n';
            _css += '    --tableChart-td-fontSize: ' + t_td_font + ';\n';
            _css += '    --tableChart-td-align: ' + t_td_align + ';\n';
            _css += '    --tableChart-td-padding: ' + t_td_padding + ';\n';
        }
    }
    _css += '}\n';
    if (popSize || popDrag) {
        _css +='.ui-icon {display: inline-block;vertical-align: middle;margin-top: -.25em;position: relative;text-indent: -99999px;overflow: hidden;background-repeat: no-repeat;}\n';
        _css +='.ui-resizable-handle {position: absolute;font-size: 0.1px;display: block;-ms-touch-action: none;touch-action: none;}\n';
        _css +='.ui-resizable-s {cursor: s-resize;height: 7px;width: 100%;bottom: -5px;left: 0;}\n';
        _css +='.ui-resizable-e {cursor: e-resize;width: 7px;right: -5px;top: 0;height: 100%;}\n';
        _css +='.ui-resizable-se {cursor: se-resize;width: 12px;height: 12px;right: 1px;bottom: 1px;}\n';
        _css +='.ui-icon {width: 16px;height: 16px;}\n';
        _css +=`.ui-icon,.ui-widget-content .ui-icon {background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='16px' height='16px' %3E%3Cg%3E%3Cpath style='opacity:1' fill='%23f9f9f9' d='M -0.5,-0.5 C 4.83333,-0.5 10.1667,-0.5 15.5,-0.5C 15.5,4.83333 15.5,10.1667 15.5,15.5C 10.1667,15.5 4.83333,15.5 -0.5,15.5C -0.5,10.1667 -0.5,4.83333 -0.5,-0.5 Z'/%3E%3C/g%3E%3Cg%3E%3Cpath style='opacity:1' fill='%23919191' d='M 11.5,1.5 C 12.525,1.89657 12.6917,2.56323 12,3.5C 9.16667,6.33333 6.33333,9.16667 3.5,12C 2.83333,12.6667 2.16667,12.6667 1.5,12C 5.03738,8.63087 8.37072,5.13087 11.5,1.5 Z'/%3E%3C/g%3E%3Cg%3E%3Cpath style='opacity:1' fill='%23909090' d='M 11.5,5.5 C 12.525,5.89657 12.6917,6.56323 12,7.5C 10.2599,9.95351 8.09326,11.4535 5.5,12C 7.70587,9.9633 9.70587,7.79663 11.5,5.5 Z'/%3E%3C/g%3E%3Cg%3E%3Cpath style='opacity:1' fill='%238b8b8b' d='M 11.5,9.5 C 12.6878,11.4959 12.0211,12.3293 9.5,12C 10.3805,11.2917 11.0472,10.4584 11.5,9.5 Z'/%3E%3C/g%3E%3C/svg%3E");}\n\n`;
    }
    if(popDrag){
        _css +='.sfc-mod div[class^="sfx_transparentOverlay"]{display:none !important;}\n';
        _css +='.sfc-mod iframe[class^="sfx_frame"]{pointer-events: unset !important;}\n';
    }
    if (btnArea == 'chart') {
        _css += '.sf-element-visual-title > .flex-item{overflow:unset !important;}\n';
    }
    _css += '/* 팝업 버튼 */\n';
    _css += '.popOpen{display:inline-block;font-weight:600;color:var(--pbtn-text-color);text-align:center;vertical-align:middle;-webkit-user-select:none;user-select:none;border:1px solid rgba(0,0,0,0.3);padding:6px 12px;line-height:1.5;border-radius:15px;font-size:15px;cursor:pointer;letter-spacing:-1px;background-color:var(--pbtn-bg-color);}\n';
    if (btnArea == 'chart') {
        _css += '.chartArea .popOpen{padding:4px 8px;font-size:13px;}';
        _css += '.chartArea ~ .chartArea{margin-left:10px;}';
    } else if (btnArea == 'text') {
        _css += '.btnWrap.textArea{position: absolute; top:var(--btn-position-top); left:var(--btn-position-left);}\n';
    }
    _css += '/* 팝업 CSS */\n';
    _css += '.popup{width: var(--popup-width);height:var(--popup-height);box-sizing: border-box;bottom: auto;position: fixed;  top:var(--popup-position-top); left: var(--popup-position-left); z-index:1;background:var(--popup-bg-color);box-shadow: 2px 1px 4px 2px rgba(0,0,0,0.5); overflow: hidden; border-radius: 10px;display:none;}\n';
    _css += '.popup p{margin:0;}\n';
    if (contentValue == "chart") {
        _css += '.popup .titleWrap{position: absolute;width: 100%; background: var(--title-bg-color); padding: 0 45px 0 20px;cursor:move;box-sizing:border-box;}\n';
        _css += '.popup .titleWrap .title{font-size: 15px; line-height: 35px; font-weight: 600; color:var(--title-txt-color); }\n';
    }else{
        _css += '.popup .titleWrap{position: relative; background: var(--title-bg-color); padding: 0 45px 0 20px;cursor:move;}\n';
        _css += '.popup .titleWrap .title{font-size: 15px; line-height: 35px; font-weight: 600; color:var(--title-txt-color); }\n';
    }
    _css += '.popup .closeBtn{display: block; position: absolute; top: 0; right: 0; width: 35px; height: 35px; background: rgba(0,0,0,.5); border:0; cursor: pointer;}\n';
    _css += '.popup .closeBtn span{display: block; width: 100%; height: 100%; font-size: 0; position: relative; transform: rotate(45deg);}\n';
    _css += '.popup .closeBtn span:before{content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; width: 18px; height: 2px; background: #fff; }\n';
    _css += '.popup .closeBtn span:after{content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; width: 18px; height: 2px; background: #fff; transform: rotate(90deg);}\n';
    if (contentValue == "edit") {
        if (popContData != '') {
            _css += '.popup .ck-content{padding: 20px; height:calc(100% - 45px); box-sizing:border-box;}\n';
            _css += '.editWrap{width:100%;height:100%;font-size:15px;}\n';
            _css += '/* edit content */\n';
            _css += ckEdit_css;
            _css += '\n';
        } else {
            _css += '.popup .contWrap{padding: 20px; height:calc(100% - 45px); box-sizing:border-box;}\n';
        }
    } else if (contentValue == "filter") {
        _css += '.filterWrap{padding:10px; margin:5px; height:calc(100% - 45px);box-sizing:border-box;overflow: auto;}\n';
        _css += '.filterWrap ul{margin:0;padding:0 0 0 10px; display:flex; flex-flow: row wrap; justify-content: space-evenly;}\n';
        _css += '.filterWrap ul li{vertical-align:top;display:inline-block; padding:15px; margin-bottom: 10px;margin-right: 10px; border: 1px solid #D1D9E6; border-radius: 5px; background-color: #f1f1f1;}\n';
        _css += '.filterWrap ul li .tit {color:var(--contents-title-color); margin-bottom: 10px;}\n';
        _css += '.filterWrap ul li .tit span {font-size: 13px;font-weight: bold;vertical-align:middle;}\n';
        _css += '.filterWrap ul li .cont *{font-size:13px;}\n';
        _css += '/* scroll bar */\n';
        _css += '.filterWrap::-webkit-scrollbar{width:8px; height:8px;}\n';
        _css += '.filterWrap::-webkit-scrollbar-track{background:#dee2e6;border-radius:5px;}\n';
        _css += '.filterWrap::-webkit-scrollbar-track-piece{background:transparent;}\n';
        _css += '.filterWrap::-webkit-scrollbar-thumb{background:#ced4da;border-radius:5px;}\n';
        _css += '.filterWrap::-webkit-scrollbar-corner{background:#dee2e6;}\n';
        _css += '.filterWrap::-webkit-resizer{background:#dee2e6;border-radius:5px;}\n';
    } else if (contentValue == "chart") {
        _css += '.popChartWrap{width:100%; height:100%; padding:10px; box-sizing:border-box;}\n';
        if(jsChartType == 'table'){
            _css += '.popChartWrap .jsTableWrap{width: 100%;height: calc(100% - 35px);margin-top: 35px; padding:5px;overflow:auto;}\n';
            _css += '.popChartWrap .jsTableWrap table{width: 100%;table-layout: fixed; border-collapse:collapse;border-spacing:0;border-left: 1px solid var(--tableChart-border-color);border-top: 1px solid var(--tableChart-border-color);box-sizing: border-box;}\n';
            _css += '.popChartWrap .jsTableWrap table th,.popChartWrap .jsTableWrap table td{border-collapse: collapse;	border-right: 1px solid var(--tableChart-border-color);border-bottom: 1px solid var(--tableChart-border-color);display: table-cell;vertical-align: middle;line-height: 1.5em;}\n';
            _css += '.popChartWrap .jsTableWrap table th{color: var(--tableChart-th-color);background-color: var(--tableChart-th-bg);font-size: var(--tableChart-th-fontSize);font-weight: 500;text-align: var(--tableChart-th-align);padding:var(--tableChart-th-padding);}\n';
            _css += '.popChartWrap .jsTableWrap table td{color: var(--tableChart-td-color);background-color: var(--tableChart-td-bg);font-size: var(--tableChart-td-fontSize);font-weight: 400;text-align: var(--tableChart-td-align);padding:var(--tableChart-td-padding);}\n';
        }else{
            _css += '.popChartWrap .jsChartWrap{width:100%; height:100%;}\n';
            _css += '.popChartWrap .jsChartWrap canvas{width:100%; height:100%;}\n';
        }
    }
    _css += '</style>\n\n';
    return _css;
}
function generatePlugin(popSize, popDrag) {
    var _plugin = '';
    if(popSize || popDrag){
        _plugin += jquery_ui;
    }
    if (contentValue == "chart") {
        if(jsChartType != 'table'){
            _plugin += chart_js;
            _plugin += chart_plugin;
        }
    }
    return _plugin;
}
function generateJS(b_title, btnArea, popSize, popDrag, c_id) {
    var _js ='';
    var dot = "'";
    if (contentValue == "chart") {
        if(jsChartType == 'table'){
            _js +='function popupCreateTable() {\n';
            _js +='    const tableWrap = document.querySelector(".jsTableWrap");\n';
            _js +='    const table = document.createElement("table");\n';
            _js +='    table.classList.add("table");\n'; 
            _js +='    const tableData = document.querySelector(".popupDatasetsData").textContent;\n';
            _js +='    const tableHeaderStyle = "'+ jsTableType +'";\n';
            _js +='    popupDrawTableFromData(tableData, table, tableHeaderStyle);\n';
            _js +='    while (tableWrap.firstChild) {\n';
            _js +='        tableWrap.removeChild(tableWrap.firstChild);\n';
            _js +='    }\n';
            _js +='    tableWrap.appendChild(table);\n';
            _js +='}\n';
            _js +='function popupDrawTableFromData(data, table, headerStyle) {\n';
            _js +='    const rows = data.split("/");\n';
            _js +='    const matrix = rows.map(row => row.split(/,\s*/));\n';
            _js +='    if (headerStyle === "Row") {\n';
            _js +='        for (let i = 0; i < matrix[0].length; i++) {\n';
            _js +='            const tr = document.createElement("tr");\n';
            _js +='            for (let j = 0; j < matrix.length; j++) { \n';
            _js +='                const cell = document.createElement(j === 0 ? "th" : "td");\n';
            _js +='                cell.textContent = matrix[j][i];\n';
            _js +='                tr.appendChild(cell);\n';
            _js +='            }\n';
            _js +='            table.appendChild(tr);\n';
            _js +='        }\n';
            _js +='    } else if (headerStyle === "Column") {\n';
            _js +='        matrix.forEach((rowData, rowIndex) => {\n';
            _js +='            const tr = document.createElement("tr");\n';
            _js +='            rowData.forEach((cellData, cellIndex) => {\n';
            _js +='                const cell = document.createElement(rowIndex === 0 ? "th" : "td");\n';
            _js +='                cell.textContent = cellData;\n';
            _js +='                tr.appendChild(cell);\n';
            _js +='           });\n';
            _js +='            table.appendChild(tr);\n';
            _js +='        });\n';
            _js +='    }\n';
            _js +='}\n';
        }else{
            _js +='var popupJsChart = null;\n';
            _js +='var popupOptions = ' + jsChartOptions +';\n';
            _js +='var popupPlugin = {\n';
            _js +='   id: "customCanvasBackgroundColor",\n';
            _js +='    beforeDraw: (chart, args, options) => {\n';
            _js +='        const { ctx } = chart;\n';
            _js +='        ctx.save();\n';
            _js +='        ctx.globalCompositeOperation = "source-over";\n';
            _js +='        ctx.fillStyle = options.color;\n';
            _js +='        ctx.fillRect(0, 0, chart.width, chart.height);\n';
            _js +='        ctx.restore();\n';
            _js +='    }\n';
            _js +='};\n';
            _js +='const popupCustomLegendSpacing = {\n';
            _js +='    id: "customLegendSpacing",\n';
            _js +='    beforeInit(chart) {\n';
            _js +='        const originalFit = chart.legend.fit;\n';
            _js +='        chart.legend.fit = function fit() {\n';
            _js +='            originalFit.bind(chart.legend)();\n';
            _js +='            if (this.options.position === "top") {\n';
            _js +='                this.height += 20; \n';
            _js +='            }\n';
            _js +='        };\n';
            _js +='    }\n';
            _js +='};\n';
            if(jsChartType == 'doughnut' || jsChartType == 'polarArea' || jsChartType == 'radar'){
                _js +='function updateDatalabelsOptions() {\n';
                _js +='    const conlabelTF = ' + jsConlabel +';\n';
                _js +='    const valueTF = ' + jsValue +';\n';
                _js +='    const percentageTF = ' + jsPercentage +';\n';
                _js +='    const existingDatalabelsOptions = popupOptions.plugins.datalabels || {};\n';
                _js +='    const newDatalabelsOptions = Object.assign({}, existingDatalabelsOptions, {\n';
                _js +='        formatter: function (value, context) {\n';
                _js +='            var idx = context.dataIndex;\n';
                _js +='            var conlabel = context.chart.data.labels[idx];\n';
                _js +='            var sum = context.dataset.data.reduce((a, b) => a + b, 0);\n';
                _js +='            var percentage = ((value / sum) * 100).toFixed(2) + "%";\n';
                _js +='            var val = value;\n';
                _js +='            var result = "";\n';
                _js +='            function showInLabel(conlabelTF, valueTF, percentageTF) {\n';
                _js +='                if (conlabelTF) {\n';
                _js +='                    result += conlabel;\n';
                _js +='                }\n';
                _js +='                if (valueTF) {\n';
                _js +='                    if (result !== "") result += ", ";\n';
                _js +='                    result += val;\n';
                _js +='                }\n';
                _js +='                if (percentageTF) {\n';
                _js +='                    if (result !== "") result += " (" + percentage + ")";\n';
                _js +='                    else result += percentage;\n';
                _js +='                }\n';
                _js +='                return result;\n';
                _js +='            }\n';
                _js +='            return showInLabel(conlabelTF, valueTF, percentageTF);\n';
                _js +='        }\n';
                _js +='    });\n';
                _js +='    popupOptions.plugins.datalabels = newDatalabelsOptions;\n';
                _js +='}\n';
            }
            _js +='function createOrUpdateChart(labels, datasets) {\n';
            _js +='    var ctx = document.getElementById("popupChart").getContext("2d");\n';
            _js +='    if (popupJsChart) {\n';
            _js +='        popupJsChart.data.labels = labels;\n';
            _js +='        popupJsChart.data.datasets.forEach((dataset, index) => {\n';
            _js +='            dataset.data = datasets[index].data;\n';
            _js +='        });\n';
            _js +='        popupJsChart.update();\n';
            _js +='    } else {\n';
            if(jsChartType == 'doughnut' || jsChartType == 'polarArea' || jsChartType == 'radar'){
                _js +='        updateDatalabelsOptions();\n';
            }
            _js +='        popupJsChart = new Chart(ctx, {\n';
            _js +='            type: "' + jsChartType +'",\n';
            _js +='            data: { labels, datasets },\n';
            _js +='            options: popupOptions,\n';
            _js +='            plugins: [popupPlugin, popupCustomLegendSpacing, ChartDataLabels]\n';
            _js +='        });\n';
            _js +='    }\n';
            _js +='}\n';
            _js +='function updateChartData() {\n';
            _js +='    var labels = document.querySelector(".popupLabelData").textContent.split(/,\\s*/);\n';
            _js +='    var datasetElements = document.querySelectorAll(".popupDatasetsData");\n';
            _js +='    var datasets = '+ jsChartDataSets +';\n';
            _js +='    datasetElements.forEach((elem, index) => {\n';
            _js +='        datasets[index].data = elem.textContent.split(/,\\s*/).map(value => value === "" ? null : Number(value));\n';
            _js +='    });\n';
            _js +='    createOrUpdateChart(labels, datasets);\n';
            _js +='}\n';
        }
    }
    _js +='// 팝업 버튼 이벤트 처리 함수\n';
    _js +='function handlePopupButton() {\n';
    if(btnArea == "chart"){
        _js +='    var btnWrap ='+dot+'<div class="btnWrap chartArea"><button class="popOpen btn">'+ b_title +'</button></div>'+dot+';\n';
        _js +='    var targetElement = $('+ dot +'.sf-element-visual[sf-visual-id^="'+ c_id +'"] .sf-element-visual-title > div.flex-item'+dot+');\n';
        _js +='    if(!targetElement.find(".btnWrap").length){\n';
        _js +='        targetElement.append(btnWrap);\n';
        _js +='    }\n';
    }
    _js +='    $(".popOpen").off("click").on("click", function() {\n';
    _js +='        $(".popup").show();\n';
    if(popSize){
        _js +='        // 차트 리사이즈 처리\n';
        _js +='        $(".popup").resizable({\n';
        //_js +='            minHeight: 350,\n';
        if (contentValue == "chart") {
            if(jsChartType != 'table'){
                _js +='            aspectRatio: true,\n';
            }
        }
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
    if (contentValue == "chart") {
        if(jsChartType == 'table'){
            _js +='        popupCreateTable();\n';
        }else{
            _js +='        updateChartData();\n';
        }
    }
    _js +='    });\n';
    _js +='}\n';
    if (contentValue == "chart") {
        _js +='// 데이터 관찰자 설정 함수\n';
        _js +='function popupDataObserver(){\n';
        _js +='    var dataObserver = new MutationObserver(mutations => {\n';
        _js +='        mutations.forEach(mutation => {\n';
        _js +='            if (mutation.type === "childList" || mutation.type === "characterData") {\n';
        if(jsChartType == 'table'){
            _js +='            popupCreateTable();\n';
        }else{
            _js +='            updateChartData();\n';
        }
        _js +='            }\n';
        _js +='        });\n';
        _js +='    });\n';
        _js +='    var config = { childList: true, characterData: true, subtree: true };\n';
        _js +='    var targetNode = document.querySelector(".popupDataWrap");\n';
        _js +='    dataObserver.observe(targetNode, config);\n';
        _js +='}\n';
    }
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
    if (contentValue == "chart") {
        _js +='    setTimeout(() => popupDataObserver(), 500);\n';
    }
    _js +='});\n';
    return _js;
}

document.querySelector('.previewBtn').addEventListener('click', function() {
    const diff = document.querySelectorAll(".preview .popup .ck-content");
    if (diff.length > 0) {
        document.querySelector('.preview .popup').remove();
    }
    var p_title = document.querySelector('.titleInput').value || '타이틀을 입력하세요';
    var p_width = document.querySelector('.puWInput').value + document.querySelector('.puWInput').getAttribute('unit');
    var p_height = document.querySelector('.puHInput').value + document.querySelector('.puHInput').getAttribute('unit');
    var p_top = document.querySelector('.puTInput').value + document.querySelector('.puTInput').getAttribute('unit');
    var p_left = document.querySelector('.puLInput').value + document.querySelector('.puLInput').getAttribute('unit');
    var p_number = document.querySelector('.filterInput').value;

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
        _html += '<div class="info"><span class="popW">Width :</span><span class="popW_txt">'+ document.querySelector('.puWInput').value +'</span> px<span class="popH">Height :</span><span class="popH_txt">'+ document.querySelector('.puHInput').value +'</span> px<button type="button" class="codeSave btn-primary animate-down-2">저장하기</button></div>';
        _html += '</div>';

    document.querySelector('.preview').innerHTML = _html;
    document.querySelector('.preview').classList.add('show');
    
    // Draggable
    $(".popup").draggable({
        "cancel": ".popup .contWrap",
        containment: ".preview",
        scroll: false
    });
    // 차트 리사이즈 처리
    $(".popup").resizable({
        minHeight: 350,
        resize: function(event, ui) {
            var ui_width = ui.size.width;
            var ui_height = ui.size.height;
            updatePopupSize(ui_width, ui_height);
        }
    });

    document.querySelector('.popup .closeBtn').addEventListener('click', function() {
        document.querySelector('.preview').classList.remove('show');
    });
    document.querySelector('.popup .codeSave').addEventListener('click', function() {
        savePopupSize();
        document.querySelector('.preview').classList.remove('show');
    });
});

document.querySelector('.editorBtn').addEventListener('click', function() {
    const diff = document.querySelectorAll(".preview .popup .filterWrap");
    if (diff.length > 0) {
        document.querySelector('.preview .popup').remove();
    }
    var p_title = document.querySelector('.titleInput').value || '타이틀을 입력하세요';
    var p_width = document.querySelector('.puWInput').value + document.querySelector('.puWInput').getAttribute('unit');
    var p_height = document.querySelector('.puHInput').value + document.querySelector('.puHInput').getAttribute('unit');
    var p_top = document.querySelector('.puTInput').value + document.querySelector('.puTInput').getAttribute('unit');
    var p_left = document.querySelector('.puLInput').value + document.querySelector('.puLInput').getAttribute('unit');

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
            _html += '<div class="info"><span class="popW">Width :</span><span class="popW_txt">'+ document.querySelector('.puWInput').value +'</span> px<span class="popH">Height :</span><span class="popH_txt">'+ document.querySelector('.puHInput').value +'</span> px<button type="button" class="codeSave btn-primary animate-down-2">저장하기</button></div>';
            _html += '</div>';

        document.querySelector('.preview').innerHTML = _html;
        document.querySelector('.preview').classList.add('show');

        //edit
        editerFn();
        
        // Draggable
        $(".popup").draggable({
            "cancel": ".popup .contWrap",
            containment: ".preview",
            scroll: false
        });
        // 차트 리사이즈 처리
        $(".popup").resizable({
            minHeight: 350,
            resize: function(event, ui) {
                var ui_width = ui.size.width;
                var ui_height = ui.size.height;
                updatePopupSize(ui_width, ui_height);
            }
        });
    }
    document.querySelector('.popup .closeBtn').addEventListener('click', function() {
        document.querySelector('.preview').classList.remove('show');
    });
});
function updatePopupSize(width, height) {
    document.querySelector('.popup .popW_txt').textContent = width;
    document.querySelector('.popup .popH_txt').textContent = height;
}
function savePopupSize(){
    document.querySelector('.puWInput').value = document.querySelector('.popup .popW_txt').textContent;
    var newWidthValue = document.querySelector('.puWInput').value + document.querySelector('.puWInput').getAttribute('unit');
    document.documentElement.style.setProperty('--' + document.querySelector('.puWInput').name, newWidthValue);
    document.querySelector('.puHInput').value = document.querySelector('.popup .popH_txt').textContent;
    var newHeightValue = document.querySelector('.puHInput').value + document.querySelector('.puHInput').getAttribute('unit');
    document.documentElement.style.setProperty('--' + document.querySelector('.puHInput').name, newHeightValue);
}
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
                savePopupSize();
                document.querySelector('.preview').classList.remove('show');
                //console.log(popContData);
            });
        })
        .catch(error => {
            console.error(error);
        });
}


