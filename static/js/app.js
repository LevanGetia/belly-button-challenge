// Define the dataset URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the data using D3 and initialize the dashboard once data is loaded
d3.json(url).then(data => {
    initialize(data);
});

// Initial setup function
function initialize(data) {
    // Populate the dropdown with sample IDs
    populateDropdown(data.names, data);

    // Display initial data (first sample in the dataset)
    let initialSample = data.names[0];
    updateBarChart(initialSample, data);
    updateBubbleChart(initialSample, data);
    displayMetadata(initialSample, data);
    updateBonus(initialSample);
}

// Function to populate the dropdown with sample IDs
function populateDropdown(sampleNames, data) {
    let dropdown = d3.select("#selDataset"); // Select the dropdown element

    // Append each sample ID as an option in the dropdown
    sampleNames.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Attach an event listener to handle change in dropdown selection
    dropdown.on("change", function() {
        let newSampleID = dropdown.property("value"); 
        updateBarChart(newSampleID, data);            
        updateBubbleChart(newSampleID, data);         
        displayMetadata(newSampleID, data);   
        updateBonus(newSampleID);         
    });
}


function updateBarChart(sampleID, data) {
    const sample = data.samples.find(s => s.id === sampleID);
    const topSampleValues = sample.sample_values.slice(0, 10).reverse();
    const topOtuIds = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const topOtuLabels = sample.otu_labels.slice(0, 10).reverse();

    const trace = {
        x: topSampleValues,
        y: topOtuIds,
        text: topOtuLabels,
        type: "bar",
        orientation: "h"
    };

    const layout = {
        title: "Top 10 OTUs"
    };

    Plotly.newPlot("bar", [trace], layout);
}

function updateBubbleChart(sampleID, data) {
    const sample = data.samples.find(s => s.id === sampleID);

    const trace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: "Earth"
        }
    };

    const layout = {
        title: "Belly Button Biodiversity",
        showlegend: false,
        height: 600,
        width: 1500
    };

    Plotly.newPlot("bubble", [trace], layout);
}

// Function to display metadata for a selected sample
function displayMetadata(sampleID, data) {
    // Filter the metadata for the selected sample ID
    let metadata = data.metadata.find(m => m.id === parseInt(sampleID));

    // Select the metadata display div and clear its content
    let metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html("");

    // Append each metadata key-value pair to the display div
    Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append("h6").text(`${key}: ${value}`);
    });
}
