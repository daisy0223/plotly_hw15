function init() {
    var dropDown = d3.select("#selDataset");
    // use sample names to populate the options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        dropDown
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // use the first sample to build the initial plots
      var firstSample = sampleNames[0];
      buildMeta(firstSample);
      Chart(firstSample);
      buildGauge(firstSample);
    });
  }
init();

function optionChanged(sample) {
      buildMeta(sample);
      Chart(sample);
      buildGauge(sample);
}

function buildMeta(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      //matched id
      var resultArray = metadata.filter(i=> i.id == sample);
      var result = resultArray[0];
      //select the panel with id of "sample-metadata"
      var sampleMetadata = d3.select("#sample-metadata");
      // clear any existing metadata
      sampleMetadata.html("");
      //add each key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        sampleMetadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }

function Chart(sample) {
    d3.json("samples.json").then((data) => {
        var values = data.samples;
        // find out the same id as in the buildMeta
        var target = values.filter(v => v.id == sample);
        // empty list
        bardata=[];
        // each id may have multiple data, so use a for loop to get corresponding data
        for (var i = 0; i < target.length; i++) {
            //console.log(target[i]); 
            var sample_v = target[i].sample_values;
            var id = target[i].otu_ids;
            var label = target[i].otu_labels;
            //combine three arrays into one
            for (var j = 0; j < sample_v.length; j++) {
                bardata.push({"otu_ids": id[j], "otu_labels":label[j], "sample_values":sample_v[j]});
            };
        };
        // descending and slicing the new array
        bardata10 = bardata
        bardata10.sort((a, b) => b.sample_values - a.sample_values);
        bardata10 = bardata10.slice(0, 10);
        bardata10 = bardata10.reverse();
        //console.log(bardata10);

        var trace1 = {
            x: bardata10.map(row => row.sample_values),
            y: bardata10.map(row => "OTU " + row.otu_ids.toString()),
            text: bardata10.map(row => row.otu_labels),
            type: "bar",
            orientation: "h"
            }; 
        var bar=[trace1];
        var layout1 = {
            showlegend: false,
          };
        Plotly.newPlot("bar", bar, layout1);
    
        
        var trace2 = {
            x: bardata.map(row => row.otu_ids),
            y: bardata.map(row => row.sample_values),
            type: 'scatter',
            mode: 'markers', 
            marker:{
                size: bardata.map(row => row.sample_values),
                color: bardata.map(row => row.otu_ids)
            },
            text: bardata.map(row => row.otu_labels)
        };
        var bubble=[trace2]
        var layout2 = {
            xaxis: {
                title: "OTU ID",
                tickmode: "linear",
                tick0: 0,
                dtick: 500
            },
            showlegend: false,
            height: 600,
          };
        Plotly.newPlot("bubble", bubble,layout2);
    });
};