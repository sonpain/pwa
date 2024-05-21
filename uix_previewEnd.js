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


// Javascript Chart Option Start ================================//
//===============================================================//

const chartButtons = document.querySelectorAll('.selectWrap');

chartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedChart = button.getAttribute('chartName');
        updateVisibility(selectedChart);
        toggleActiveButton(button);
    });
});

function toggleActiveButton(clickedButton) {
    // 모든 버튼에서 'on' 클래스 제거
    chartButtons.forEach(button => {
        button.classList.remove('on');
    });
    // 클릭된 버튼에 'on' 클래스 추가
    clickedButton.classList.add('on');
}

function updateVisibility(selectedChart) {
    const chartWraps = document.querySelectorAll('.chartWrap');

    chartWraps.forEach(wrap => {
        // 모든 차트 div를 숨깁니다.
        wrap.style.display = 'none';
    });

    // 선택된 차트에 해당하는 div만 표시합니다.
    const selectedWrap = document.querySelector(`.${selectedChart}ChartWrap`);
    if (selectedWrap) {
        selectedWrap.style.display = 'block';
    }
}

// 선택된 버튼의 chartName 값을 가져옵니다.
function getSelectedChartType() {
    const selectedButton = document.querySelector('.selectWrap.on');
    if (selectedButton) {
        return selectedButton.getAttribute('chartName');
    }
    return null;
}

initializeChart('barChartWrap');
initializeChart('lineChartWrap');
initializeChart('doughnutChartWrap');
initializeChart('polarAreaChartWrap');
initializeChart('tableChartWrap');

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

    const lastInput = lastDataSet.querySelector('.barDataInput, .lineDataInput');
    const inputType = lastInput.classList.contains('barDataInput') ? 'barData' : 'lineData';
    const newInputId = `${inputType}${dataSetCount}`;
    clonedDataSet.querySelector('.barDataInput, .lineDataInput').id = newInputId;
    clonedDataSet.querySelector('.barDataInput, .lineDataInput').value = '';

    clonedDataSet.querySelector('.categoryName').value = '';
    clonedDataSet.querySelector('.chartColor').value = '';
    //clonedDataSet.querySelector('.chartAxisSelect').value = 'y1';
    //clonedDataSet.querySelector('.axisLineSelect').value = 'false';

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


initializeOptionMenus('barChartWrap');
initializeOptionMenus('lineChartWrap');
initializeOptionMenus('doughnutChartWrap');
initializeOptionMenus('polarAreaChartWrap');

function initializeOptionMenus(chartType) {
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


//차트 옵션 설정
document.querySelector('.prevChart').addEventListener('click', function() {
    const chartType = getSelectedChartType();
    const tablePreviewWrap = document.querySelector('.tablePreviewWrap');
    const chartPreviewWrap = document.querySelector('.chartPreviewWrap');
    if (chartType === 'table') {
        tablePreviewWrap.style.display = 'block';
        chartPreviewWrap.style.display = 'none';
        // 팝업에 이미 차트가 그려진 경우 해당 차트를 삭제합니다.
        if (window.prevChart) {
            window.prevChart.destroy();
            delete window.prevChart;
        }
        createTable();
        showPopupChart();
    } else {
        const chartData = prepareChartData();
        // 만약 이미 표가 그려진 상태라면 해당 표를 제거합니다.
        if (tablePreviewWrap.firstChild) {
            tablePreviewWrap.removeChild(tablePreviewWrap.firstChild);
            tablePreviewWrap.style.display = 'none';
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
    }

    return labelDataInput ? labelDataInput.value.split(',') : [];
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
    } else {
        return []; 
    }

    return Array.from(document.querySelectorAll(`${containerSelector} .dataWrap`)).map(dataWrap => {
        let dataset = {
            label: dataWrap.querySelector('.categoryName')?.value,
            data: [],
            backgroundColor: dataWrap.querySelector('.chartColor')?.value
        };

        const dataInput = dataWrap.querySelector('.barDataInput, .lineDataInput, .doughnutDataInput, .polarAreaDataInput'); 
        if (dataInput) {
            dataset.data = dataInput.value.split(',').map(Number);
        }

        if (chartType === 'line') {
            dataset.borderColor = dataset.backgroundColor;
            dataset.borderDash = dataWrap.querySelector('.lineStyleSelect')?.value.split(',').map(Number);
            if(dataset.backgroundColor){
                dataset.pointBackgroundColor = dataset.backgroundColor;
            }
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
        }    

        const chartAxisSelect = dataWrap.querySelector('.chartAxisSelect');
        if (chartAxisSelect && chartAxisSelect.value) {
            dataset.yAxisID = chartAxisSelect.value;
        }
        return dataset;
    }).filter(dataset => dataset.label && dataset.data.length > 0);
}

function collectUserOptions() {
    const chartType = getSelectedChartType();
    const options = {};
    const chartContainer = document.querySelector(`.${chartType}ChartWrap`); 
    
    // 공통 옵션 설정
    const commonSettings = [
        { selector: '.label-check', optionName: 'plugins.datalabels.display', transform: v => v === 'true' },
        { selector: '.label-position', optionName: 'plugins.datalabels.anchor', transform: v => v },
        { selector: '.label-position', optionName: 'plugins.datalabels.align', transform: v => v },
        { selector: '.legend-check', optionName: 'plugins.legend.display', transform: v => v === 'true' },
        { selector: '.legend-position', optionName: 'plugins.legend.position', transform: v => v },
        { selector: '.legend-style', optionName: 'plugins.legend.labels.pointStyle', transform: v => v },
        { selector: '.tooltip-check', optionName: 'plugins.tooltip.enabled', transform: v => v === 'true' },
        // 추가된 공통 설정
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
            setOptionValue(options, optionName, transform(element.value));
        }
    });

    // 축 설정 및 글꼴 크기 입력 처리
    const fontSizeInput = chartContainer.querySelector('.common-font-size');
    if (fontSizeInput && fontSizeInput.value) {
        const fontSize = parseFloat(fontSizeInput.value);
        setOptionValue(options, 'scales.x.ticks.font.size', fontSize);
        setOptionValue(options, 'scales.y1.ticks.font.size', fontSize);

        // y2 축의 존재 여부를 확인하고 설정
        const y2AxisSelected = Array.from(chartContainer.querySelectorAll('.chartAxisSelect')).some(select => select.value === 'y2');
        if (y2AxisSelected) {
            setOptionValue(options, 'scales.y2.ticks.font.size', fontSize);
        }
    }

    // 축 위치 선택 처리를 각 데이터 세트에 대해 개별적으로 적용
    chartContainer.querySelectorAll('.dataWrap').forEach(dataWrap => {
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
            { selector: '.out-label-check', optionName: 'scales.r.pointLabels.display', transform: v => v === 'true' }
        ];
        doughnutOptions.forEach(({ selector, optionName, transform }) => {
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
    // 기본 옵션 구조를 설정합니다.
    let defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        spanGaps: true,
        layout: { padding: { top: 45, bottom: 10, left: 10, right: 15 } },
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

    // 차트 유형에 따라 다른 설정을 적용합니다.
    if (userOptions.type === 'bar') {
        defaultOptions = Object.assign(defaultOptions, {
            barPercentage: 0.9,
            borderRadius: 3,
            scales: {
                x: { position: "bottom", grid: { display: true } },
                y1: { position: "left", grid: { display: false } }
            }
        });
    } else if (userOptions.type === 'line') {
        defaultOptions = Object.assign(defaultOptions, {
            tension: 0,
            borderWidth: 3,
            pointRadius: 5,
            stepped: false,
            scales: {
                x: { position: "bottom", grid: { display: true } },
                y1: { position: "left", grid: { display: false } }
            }
        });
    } else if (userOptions.type === 'doughnut') {
        defaultOptions = Object.assign(defaultOptions, {
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

                    }
                }
            }
        });
    } else if (userOptions.type === 'polarArea') {
        defaultOptions = Object.assign(defaultOptions, {
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

                    }
                }
            }
        });
    }

    // 기본 옵션과 사용자 지정 옵션을 병합합니다.
    return deepMerge(defaultOptions, userOptions);
}

// 차트 생성 또는 업데이트
function updateOrCreateChart({ labels, datasets, finalOptions }) {
    console.log(labels, datasets, finalOptions);
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
    drawTableFromData(tableData, table, tableHeaderStyle);

    // 기존의 표가 있다면 삭제합니다.
    while (tableWrap.firstChild) {
        tableWrap.removeChild(tableWrap.firstChild);
    }
    // 새로운 표를 추가합니다.
    tableWrap.appendChild(table);
}

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

// table option 정의
function applyTableStyles(tableElement) {
    const inputs = tableElement.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
        document.documentElement.style.setProperty('--' + input.name, input.value);
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
// tablePreview option
document.querySelectorAll('.tableChartWrap .dataSets_option input , .tableChartWrap .dataSets_option select').forEach(function(input) {
    input.addEventListener('change', handleInputValueUpdate);
});

// closeBtn 버튼 클릭 시 팝업 닫기
document.querySelector('.popChartWrap .closeBtn').addEventListener('click', function() {
    const popChartWrap = document.querySelector('.popChartWrap');
    // 팝업을 닫을 때 인라인 CSS를 제거합니다.
    popChartWrap.style.display = 'none';
    popChartWrap.style.width = '';
    popChartWrap.style.height = '';
    popChartWrap.style.top = '';
    popChartWrap.style.left = '';
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
