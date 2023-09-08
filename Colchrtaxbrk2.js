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

//            this.render()
        }

//        onCustomWidgetResize(width, height) {
//            this.render()
//        }

        async render(dim,resultset1) {
            await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
            await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
            await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');

am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create(this._root, am4charts.XYChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
// get data from the resultset	passed from SAC	
var data = [];
console.log(["r",resultset1.length]);		
		for(var i = 0; i<resultset1.length; i++){
			console.log("in col chrt");
			var a = {
				category:resultset1[i][dim].description,
				value:resultset1[i]["@MeasureDimension"].rawValue
			}
			data.push(a)
		}

		chart.data = data;
/*		
//chart.data = [
//  {
    country: "USA",
    visits: 23725
  },
  {
    country: "China",
    visits: 1882
  },
  {
    country: "Japan",
    visits: 1809
  },
  {
    country: "Germany",
    visits: 1322
  },
  {
    country: "UK",
    visits: 1122
  },
  {
    country: "France",
    visits: 1114
  },
  {
    country: "India",
    visits: 984
  },
  {
    country: "Spain",
    visits: 711
  },
  {
    country: "Netherlands",
    visits: 665
  },
  {
    country: "Russia",
    visits: 580
  },
  {
    country: "South Korea",
    visits: 443
  },
  {
    country: "Canada",
    visits: 441
  }
];
*/
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.minGridDistance = 40;
categoryAxis.fontSize = 11;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.max = 120000000;
valueAxis.strictMinMax = true;
valueAxis.renderer.minGridDistance = 30;
// axis break
var axisBreak = valueAxis.axisBreaks.create();
console.log(["start", resultset1[1]["@MeasureDimension"].rawValue + 40000]);
console.log(["end",resultset1[0]["@MeasureDimension"].rawValue - 40000]);
axisBreak.startValue = (resultset1[1]["@MeasureDimension"].rawValue + 40000);
axisBreak.endValue = (resultset1[0]["@MeasureDimension"].rawValue - 40000);
//axisBreak.breakSize = 0.005;

// fixed axis break
var d = (axisBreak.endValue - axisBreak.startValue) / (valueAxis.max - valueAxis.min);
axisBreak.breakSize = 0.05 * (1 - d) / d; // 0.05 means that the break will take 5% of the total value axis height

// make break expand on hover
var hoverState = axisBreak.states.create("hover");
hoverState.properties.breakSize = 1;
hoverState.properties.opacity = 0.1;
hoverState.transitionDuration = 1500;

axisBreak.defaultState.transitionDuration = 1000;
/*
// this is exactly the same, but with events
axisBreak.events.on("over", function() {
  axisBreak.animate(
    [{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }],
    1500,
    am4core.ease.sinOut
  );
});
axisBreak.events.on("out", function() {
  axisBreak.animate(
    [{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }],
    1000,
    am4core.ease.quadOut
  );
});*/

var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.categoryX = "category";
series.dataFields.valueY = "value";
series.columns.template.tooltipText = "{valueY.value}";
series.columns.template.tooltipY = 0;
series.columns.template.strokeOpacity = 0;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add("fill", function(fill, target) {
  return chart.colors.getIndex(target.dataItem.index);
});
		}
	}
	customElements.define("com-demo-colchrtaxbrk2", SamplePrepared)
})()
