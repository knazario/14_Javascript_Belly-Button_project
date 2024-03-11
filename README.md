# 14_Javascript_Belly-Button_project

### Project Overview
In this project, I created an interactive dashboard using HTML, CSS and Javascript, using belly button microbe sample data(see reference below). The dashboard allows you to select an individual subject (ID) from the dataset using a dropdown menu and updates the interactive Plotly charts and demographic informaiton based on your selection. 

The interactive charts include:
    - a bar chart displaying the Top 10 microbial species/OTUs(Operational taxonomic units) found in the subject
    - a bubble (scatter) chart that shows all the OTU samples found in the subject (size of bubble is based on sample value of the microbes, i.e. more of the microbes means a larger bubble). 
    - a gauge chart that shows the number of belly button washings the subject reported per week

For the bubble chart, and additional feature of selecting the color scale was added. 

### Live Demo
This project is currently hosted on Github Pages and can be demoed 'live' at the url below:<br/>
https://knazario.github.io/14_Javascript_Belly-Button_project/

### Data
For this project, data was downloaded using a JSON promise request, but a copy of the data is located in the repository in the '[data](data/samples.json)' folder. 

### Data Reference
Hulcr, J. et al. (2012) A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable. Retrieved from: http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/ . 

### Code Source
Additional resources referenced and utilzied for my project code are listed below: 

- Setting the value of each dropdown option using javascript (dropDown.append('option').text(names[i]).attr('value',i);)<br/>
https://gist.github.com/uicoded/dec8786d89184c88fa8f2c0abcdc152d

- Bubble chart documentation<br/>
https://plotly.com/javascript/bubble-charts/

- Creating button for colorscale options<br/>
 https://plotly.com/javascript/custom-buttons/

- Colorscale documentation for bubble chart button<br/>
https://plotly.com/javascript/colorscales/

- Restyling documentation<br/>
https://plotly.com/javascript/plotlyjs-function-reference/

- Object.entries() documentation to access key-value pairs of dictionary<br/>
https://javascript.info/keys-values-entries
