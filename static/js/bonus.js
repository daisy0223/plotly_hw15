function buildGauge(sample) {
    d3.json("samples.json").then((data) => {
        var wfreq = data.metadata;
        wfreq = wfreq.filter(v => v.id == sample);
        wfreq = wfreq[0].wfreq;

                    wfreq_text=[]
                    for (var i = 8; i >= 0; i--) {
                        wfreq_text.push(i.toString() + '-' + (i+1).toString());
                    }
                    var wfreq_indicator = [
                        { 
                            title: {
                                text: "Belly Button Washing Frequency<br>Scrubs per Week",
                                position: 'top center'
                            },
                values: [1,1,1,1,1,1,1,1,1,9],
                rotation: 90,
                text: wfreq_text,
                textinfo: 'text',
                textposition:'inside',
                marker: {colors:['44aa44','66dd66','88ee88','aaffaa','ddffbb','eeffbb','ffffbb','ffffdd','ffffee','ffffff']},
                hoverinfo: 'label',
                hole: 0.5,
                type: 'pie',
                showlegend: false
            }
        ];
        
        var radians = (9-wfreq)*20 * Math.PI / 180;
        var x = 0.5 + 0.2*Math.cos(radians);
        var y = 0.5 + 0.2*Math.sin(radians);
        var mainPath = 'M 0.48 0.45 L 0.52, 0.45 L ';
        pathX = String(x);
        space = ' ';
        pathY = String(y);
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var layout3 = {
            height: 600,
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
        
                line: {
                color: '850000'
                }
            }],
        };

        Plotly.newPlot('gauge', wfreq_indicator, layout3);
    });
};

