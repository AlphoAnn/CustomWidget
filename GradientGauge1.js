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
			
			// create chart
			var chart = am4core.create("chartdiv", am4charts.GaugeChart);
			chart.innerRadius = -15;

			var axis = chart.xAxes.push(new am4charts.ValueAxis());
			axis.min = 0;
			axis.max = 100;
			axis.strictMinMax = true;

			var colorSet = new am4core.ColorSet();

			var gradient = new am4core.LinearGradient();
			gradient.stops.push({color:am4core.color("red")})
			gradient.stops.push({color:am4core.color("yellow")})
			gradient.stops.push({color:am4core.color("green")})

			axis.renderer.line.stroke = gradient;
			axis.renderer.line.strokeWidth = 15;
			axis.renderer.line.strokeOpacity = 1;

			axis.renderer.grid.template.disabled = true;

			var hand = chart.hands.push(new am4charts.ClockHand());
			hand.radius = am4core.percent(97);

			setInterval(function() {
				hand.showValue(Math.random() * 100, 1000, am4core.ease.cubicOut);
			}, 2000);
		}
	}
	customElements.define("com-demo-gradientgauge1", SamplePrepared)
})()
