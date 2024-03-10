const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(url).then(function(data) {

  // Can send names or data.names (data already had a list of names/subject ids for us)
  let names = data.samples.map(name => name.id);
  
  //Call createDropDown function to create interactive dropdown menu by passing list of subject ID numbers. 
  createDropDown(data.names);
  
  //DELETE WHEN DONE ******************************8
  console.log(data.samples[2]);
  
  //call init to initialize all charts with sample data (element 0, id: 940)
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
  createBar(person);
  createBubble(person);
  createDemo(demographics);
  createGauge(demographics);
}

function createBar(person){
  // slice first 10 (top 10) OTU ids and map text 'OTU' in front of each ID 
  let top10_ids = person.otu_ids.slice(0,10).map(id => `OTU ${id}  `);

  // Trace1 for horizontal bar chart
  // use .reverse for each element in order to get horizontal bar to show in descending order (top to bottom)
  let trace1 = {
    x: person.sample_values.slice(0,10).reverse(),
    y: top10_ids.reverse(),
    text: person.otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
  };

  // Data array
  let bar = [trace1];
  // Apply layout (height/width)
  let layout = {
    height: 500, 
    width: 450
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", bar, layout);
}

function createBubble(person){
  let trace2 = {
    x: person.otu_ids,
    y: person.sample_values,
    text: person.otu_labels,
    mode: 'markers',
    marker: {
      color: person.otu_ids,
      colorscale:'Earth',
      size: person.sample_values
    }
  };
  
  let data = [trace2];
  
  let annotations = [{
    text: 'Color Scale:',
    y: 1.1,
    yref: 'paper',  
    align: 'left',
    showarrow: false,
  }];

  let updatemenus=[{
    buttons: [
      {
        args: ['marker.colorscale', 'Earth'],
        label: 'Earth',
        method: 'restyle'
      },
      {
        args: ['marker.colorscale', 'Viridis'],
        label: 'Viridis',
        method: 'restyle'
    },
      {
        args: ['marker.colorscale', 'Jet'],
        label:'Jet',
        method:'restyle'
      }
    ],
    direction: 'left',
    pad: {'r': 0, 't': 10},
    showactive: true,
    type: 'buttons',
    x: 0.18,
    xanchor: 'left',
    y: 1.15,
    yanchor: 'top'
  }];

  let layout = {
    showlegend: false,
    height: 600,
    width: 1300,
    //FOR INDEX2 // width: 750,
    updatemenus: updatemenus,
    annotations:annotations
  };

  //let config = {responsive: true}
  
  Plotly.newPlot('bubble', data, layout);
}

function createDemo(demographics){
  let demo_list = Object.entries(demographics);
  let demo_chart = d3.select('#sample-metadata');
  //d3.select('#sample-metadata').append('ul').attr('style',"list-style-type:none;");
  //let test = d3.select('#sample-metadata').select('ul');
  for (i = 0; i < demo_list.length;i++){
    demo_chart.append('p').text(`${demo_list[i][0]}: ${demo_list[i][1]}`).attr("style","margin-bottom: .5rem;");
    //test.append('li').text(`${demo_list[i][0]}: ${demo_list[i][1]}`);
  }
}

function createGauge(demographics){
  console.log(demographics.wfreq)
  let data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: demographics.wfreq,
      title: { text: "Belly Button Washing Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: "lightgray", name: "0-1"},
          { range: [7, 8], color: "lightgray", name: "0-1"},
          { range: [2, 3], color: "lightgray", name: "0-1"},
          { range: [3, 4], color: "lightgray", name: "0-1"},
          { range: [4, 5], color: "lightgray", name: "0-1"},
          { range: [5, 6], color: "lightgray", name: "0-1"},
          { range: [6, 7], color: "lightgray", name: "0-1"},
          { range: [7, 8], color: "lightgray", name: "0-1"},
          { range: [8, 9], color: "gray" }
        ]}
    }
  ];
  let layout = {width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
}

function optionChanged(id){
  console.log(id);
  d3.json(url).then(function(data) {
    let person = data.samples[id];
    let demographics = data.metadata[id];

    //Restyle Bar Graph

    // slice first 10 (top 10) OTU ids and map text 'OTU' in front of each ID 
    let top10_ids = person.otu_ids.slice(0,10).map(id => `OTU ${id}  `);

    Plotly.restyle('bar', 'x',[person.sample_values.slice(0,10).reverse()]);
    Plotly.restyle('bar', 'y',[top10_ids.reverse()]);
    Plotly.restyle('bar', 'text',[person.otu_labels.slice(0,10).reverse()]);
  
    //Restyle Bubble Chart
    let update = {
      x: [person.otu_ids],
      y: [person.sample_values],
      text: [person.otu_labels],
      'marker.color':[person.otu_ids],
      'marker.size': [person.sample_values]
    }
    
    Plotly.restyle('bubble',update);


    //Update demographics 
    d3.select('#sample-metadata').html('');
    //d3.select('#sample-metadata').selectAll('p').remove());
    console.log(demographics);
    createDemo(demographics);
  
  });
}
