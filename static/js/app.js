// Utilizing the D3 library to read in the samples.json 
const sampleUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(sampleUrl).then(function(bellyData) {
    console.log(bellyData);
  });

// Create a dropdown menu utilizing D3
let dropdown = d3.select("#selDataset");
d3.json(sampleUrl).then(function(data) {
    let names = data.names;
    names.forEach(name => {
        dropdown.append("option").text(name).property("value");
    });

    // Call function to display initial plot
    updatePlotly(data.names[0], data);
});

// Update Plotly
function updatePlotly(newSample, data) {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == newSample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Create a horizontal bar chart with the top 10 OTUs
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
    ];

    let barLayout = {
        title: "Top 10 OTUs Found",
        margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
}

// Bubble chart
// Calling updated Plotly
d3.selectAll("#selDataset").on("change", updateSample);

// Function for dopdown menu selection
function updateSample() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let selectedSample = dropdownMenu.property("value");

    d3.json(sampleUrl).then(function(data) {
        // Call updatePlotly() when a change takes place to the DOM
        updatePlotly(selectedSample, data);
    });
}

function updatePlotly(newSample, data) {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == newSample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Create a horizontal bar chart with the top 10 OTUs
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
    ];

    let barLayout = {
        title: "Top 10 OTUs Found",
        margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Create a bubble chart for each sample
    let bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
    ];

    let bubbleLayout = {
        title: "Belly Button Biodiversity",
        xaxis: { title: "OTU ID" },
        showlegend: false,
        height: 600,
        width: 1200
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // Add metadata
    let metadata = data.metadata;
    let metadataArray = metadata.filter(sampleObj => sampleObj.id == newSample);
    let metadataResult = metadataArray[0];
    let metadataSection = d3.select("#sample-metadata");

    // Clear out previous metadata
    metadataSection.html("");

    // Add each key-value pair to the metadata section
    Object.entries(metadataResult).forEach(([key, value]) => {
        metadataSection.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
}

// Function called when dropdown menu item is selected
function optionChanged(newSample) {
    d3.json(sampleUrl).then(function(data) {
        // Call updatePlotly() when a change takes place to the DOM
        updatePlotly(newSample, data);
    });
}