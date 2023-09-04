var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    const prepared = document.createElement('template')
    prepared.innerHTML = `
<style>
</style>
<div id="root" style="width: 100%; height: 100%;">
</div>
`
    class SamplePrepared extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(prepared.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root')

            this._props = {}

            this.render()
        }

        onCustomWidgetResize(width, height) {
            this.render()
        }

        async render() {
            await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
            await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
            await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');

  am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create(this._root, am4charts.XYChart);

// Add data
chart.data = [{
  "date": new Date(2018, 3, 20),
  "value": 90
}, {
  "date": new Date(2018, 3, 21),
  "value": 102
}, {
  "date": new Date(2018, 3, 22),
  "value": 65
}, {
  "date": new Date(2018, 3, 23),
  "value": 62
}, {
  "date": new Date(2018, 3, 24),
  "value": 55
}, {
  "date": new Date(2018, 3, 25),
  "value": 81
}];

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

// Create value axis
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var lineSeries = chart.series.push(new am4charts.LineSeries());
lineSeries.dataFields.valueY = "value";
lineSeries.dataFields.dateX = "date";
lineSeries.name = "Sales";
lineSeries.strokeWidth = 3;

// Add simple bullet
var bullet = lineSeries.bullets.push(new am4charts.Bullet());
var image = bullet.createChild(am4core.Image);
image.href = "https://www.amcharts.com/lib/images/star.svg";
image.width = 30;
image.height = 30;
image.horizontalCenter = "middle";
image.verticalCenter = "middle";
		}
	}
	customElements.define("com-demo-lncustblt1", SamplePrepared)
})()
