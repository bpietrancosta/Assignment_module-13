function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(subject) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var samples = data.samples;
    
    // The nature of this data is that there'll only be 1 match and we want the first and only match
    var subjectBacteria = samples.filter(sampleObj => sampleObj.id == subject)[0];
    var subjectMetadata = metadata.filter(sampleObj => sampleObj.id == subject)[0];

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = subjectBacteria["otu_ids"];
    var sampleValues = subjectBacteria["sample_values"];
    var otuLabels = subjectBacteria["otu_labels"];
     

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = subjectMetadata["wfreq"];

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sampleValues.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    }
    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      height: 350,
      width: 450,
      title: {
        text: "<b>Top 10 Bacteria Cultures Found</b>",
        color: "black"
      },
      font: {
        color: "black"
      }
      };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      y: sampleValues,
      x: otuIds,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        colorscale: "Earth",
        size: sampleValues
      }
    }
    ];

    // Deliverable 2: 2. Create the layout for the bubble chart.

    var bubbleLayout = {
      height: 600,
      width: 1230,
      title: {
        text: "<b>Bacteria Cultures Per Sample</b>",
        font: {
          color: "black"
      }
      },
      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      margin: {
        l:30,
        r:30,
        b:50,
        t:30,
        pad: 1
      },
      hovermode: 'closest'
    }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // Deliverable 3: 4. Create the trace for the gauge chart.

    var gaugeData =[{
      value: wfreq,
      title: {text: "Scrubs per week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0, 10]},
        tick0: 0,
        dtick: 2,
        nticks: 0,
        steps: [
          { range: [0, 2], color: "red"},
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "lightgreen"},
          { range: [8, 10], color: "darkgreen"},
        ],
        bar: {color: "black"}
        },
      }
    ];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.

    var gaugeLayout = {
      width: 550,
      height: 350,
      xaxis: {
        tickmode: "linear",
        tick0: 0,
        dtick: 2
      },
      title: {
        text: "<b>Belly Button Washing Frequency</b>",
        font: {
          color: "black"
        }
      }
    }

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
