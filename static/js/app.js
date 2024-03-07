const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Read in data using D3
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {

  //Call createDropDown function to creater interactive dropdown menu by passing list of subject ID numbers. 
  createDropDown(data.names);
  console.log(data.samples[1]);
  init(data);
});

// Function will append dropdown options for each name in sample dataset and append value and text
function createDropDown(names){
  let dropDown = d3.select("#selDataset");
  for (i = 0; i < names.length; i++){
    dropDown.append('option').text(names[i]).attr('value',i);
  }
}

function init(data){
  let person = data.samples[0];
  let demographics = data.metadata[0];
  updateBar(person);
  updateBubble(person);
  updateDemo(demographics);
}

function updateBar(person){
  let labels = [];
  let top10_ids = person.otu_ids.slice(0,10); 
  for (i = 0; i < top10_ids.length; i++){
    labels.push(`OTU ${top10_ids[i]}  `);
  }

  // Trace1 for horizontal bar chart
  let trace1 = {
    x: person.sample_values.slice(0,10).reverse(),
    y: labels.reverse(),
    text: person.otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
  };

  // Data array
  let bar = [trace1];
  // Apply layout (height/width)
  let layout = {
    height: 500, 
    width: 350
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", bar, layout);
}

function updateBubble(person){
  let trace2 = {
    x: person.otu_ids,
    y: person.sample_values,
    text: person.otu_labels,
    mode: 'markers',
    marker: {
      color: person.otu_ids,
      //colorscale: 'Jet',
      size: person.sample_values
    }
  };
  
  let data = [trace2];
  
  let layout = {
    showlegend: false,
    height: 500,
    width: 800,
  };
  
  Plotly.newPlot('bubble', data, layout);
}

function updateDemo(demographics){
  console.log(demographics);
  console.log(Object.entries(demographics));
  let demo_list = Object.entries(demographics);
  demo_chart = d3.select('.card-header');
  for (i = 0; i < demo_list.length;i++){
    demo_chart.append('p').text(`${demo_list[i][0]}: ${demo_list[i][1]}`)
  }
}

function optionChanged(id){
  console.log(id);
}

//USE MAP to do FILTERING and adding OTU text instead of FOR LOOP 



// // Trace1 for the Greek Data
// let trace1 = {
//   x: slicedData.map(object => object.greekSearchResults),
//   y: slicedData.map(object => object.greekName),
//   text: slicedData.map(object => object.greekName),
//   name: "Greek",
//   type: "bar",
//   orientation: "h"
// };

// // Data array
// let data = [trace1];

// // Apply a title to the layout
// let layout = {
//   title: "Greek gods search results",
//   margin: {
//     l: 100,
//     r: 100,
//     t: 100,
//     b: 100
//   }
// };

// // Render the plot to the div tag with id "plot"
// Plotly.newPlot("plot", data, layout);