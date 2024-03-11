const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(url).then(function(data) {

  // Create list of subject ids for dropdown (alternatively could use data.names in data source)
  let names = data.samples.map(name => name.id);
  
  //Call createDropDown function to create interactive dropdown menu by passing list of subject ID numbers. 
  createDropDown(names);
  
  //call init to initialize all charts with sample data (element 0, id: 940)
  init(data);
  
  d3.select("#selDataset").on("change", updateAll);

  // updateAll function needs to be within .then() in order to access data and run on dropdown change
  function updateAll(){
    // Assign the value of the dropdown menu option to a variable
    let sub_id = d3.select("#selDataset").property("value");
    // assign bacteria and demographic data to selected id based on array position 
    let person = data.samples[sub_id];
    let demographics = data.metadata[sub_id];

    //Restyle Bar Graph
    // slice first 10 (top 10) OTU ids and map text 'OTU' in front of each ID 
    let top10_ids = person.otu_ids.slice(0,10).map(id => `OTU ${id}  `);
    // Update person/subject-specific data in bargraph (x values, y values and hover text)
    let updateBar = {
      x: [person.sample_values.slice(0,10).reverse()],
      y: [top10_ids.reverse()],
      text:[person.otu_labels.slice(0,10).reverse()]
    }
    // Restyle bar graph using updated data
    Plotly.restyle('bar', updateBar);

    //Restyle Bubble Chart
    // Update person/subject-specific data in bargraph (x values, y values and hover text)
    let updateBubble = {
      x: [person.otu_ids],
      y: [person.sample_values],
      text: [person.otu_labels],
      'marker.color':[person.otu_ids],
      'marker.size': [person.sample_values]
    }
    
    Plotly.restyle('bubble',updateBubble);


    //Update demographics 
    d3.select('#sample-metadata').html('');
    //d3.select('#sample-metadata').selectAll('p').remove());
    console.log(demographics);
    createDemo(demographics);

    //Update Gague Chart (send new value for wfreq)
    Plotly.restyle('gauge','value',[demographics.wfreq]);
  }
});

// Function will append dropdown options for each name in sample dataset and append value and text
function createDropDown(names){
  // select dropdown tag (select tag with id = selDataset)
  let dropDown = d3.select("#selDataset");
  // iterate through list of subject ids and create an option tag with each id and with a value corresponding to array position
  for (i = 0; i < names.length; i++){
    dropDown.append('option').text(names[i]).attr('value',i);
  }
}

function init(data){
  //setting dataset to first subject (940): assigning variable for bacteria data and demographic data
  let person = data.samples[0];
  let demographics = data.metadata[0];
  //call each chart/visual function to generate initial charts/visuals with sample dataset
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
  //trace 2 for bubble chart
  let trace2 = {
    x: person.otu_ids,
    y: person.sample_values,
    text: person.otu_labels,
    mode: 'markers',
    marker: {                   // for each point/bubble, set color based on OTU ID and size based on sample value
      color: person.otu_ids,
      colorscale:'Earth',       // set default colorscale to Earth color palette
      size: person.sample_values
    }
  };
  // set data array
  let bubble = [trace2];
  // annotate line of text for Color Scale Menu
  let annotations = [{
    text: 'Color Scale:',
    y: 1.1,
    yref: 'paper',  
    align: 'left',
    showarrow: false,
  }];
  // Create 3 buttons for 3 different color scales to alternate between when displaying bubble chart 
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
    x: 0.12,
    xanchor: 'left',
    y: 1.15,
    yanchor: 'top'
  }];
  // set layout (h, w, menu, annotations and xaxis label)
  let layout = {
    showlegend: false,
    height: 600,
    width: 1300,
    updatemenus: updatemenus,
    annotations:annotations,
    xaxis: {title:{text: 'OTU ID'}}
  };
  // Render the plot to the div tag with id "bubble"
  Plotly.newPlot('bubble', bubble, layout);
}

function createDemo(demographics){
  // create a list of demographic key/value pairs
  let demo_list = Object.entries(demographics);
  // select the div where the demographic data needs to be inserted
  let demo_chart = d3.select('#sample-metadata');
  // iterate through key/value pairs and append each pair to a paragraph element in the div
  // apply style to adjust default margin to decrease spacing between lines
  for (i = 0; i < demo_list.length;i++){
    demo_chart.append('p').text(`${demo_list[i][0]}: ${demo_list[i][1]}`).attr("style","margin-bottom: .5rem;");
  }
}

function createGauge(demographics){
  // trace 3 for gague chart
  let trace3 = {
    domain: { x: [0, 1], y: [0, 1] },
    value: demographics.wfreq,    // set value of washing frequency to gauge value 
    title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
    type: "indicator",
    mode: "gauge+number",   // display gauge and number 
    gauge: {
      axis: { // set range, tick steps and font size 
        range: [null, 9], 
        tickvals: [1,2,3,4,5,6,7,8,9], 
        ticktext:[1,2,3,4,5,6,7,8,9],
        visible:true, 
        tickfont:{size: 18}
      },
      bar: {color: '#005a70'},  // set gauge bar color 
      steps: [              // set 9 steps with a gradient of colors for each step
        { range: [0, 1], color: "#c0dfe7"}, 
        { range: [1, 2], color: "#a0cfdb"},  
        { range: [2, 3], color: "#80bfce"},  
        { range: [3, 4], color: "#60afc2"},  
        { range: [4, 5], color: "#50a7bc"},  
        { range: [5, 6], color: "#409fb5"},  
        { range: [6, 7], color: "#2893ac"},  
        { range: [7, 8], color: "#1087a3"},  
        { range: [8, 9], color: "#007e9c"}   
      ]}
  };
  // data array for plot 
  let gauge = [trace3];
  // set layout 
  let layout = {
    width: 600, 
    height: 500, 
    margin: { t: 0, b: 0 }, 
  };
  // Render the plot to the div tag with id "gauge"
  Plotly.newPlot('gauge', gauge, layout);
}