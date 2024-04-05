// Step 1
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  console.log(data);
});

// Step 2 BAR CHART

// Define dimensions and margins for the chart
const margin = { top: 20, right: 20, bottom: 50, left: 150 };
const width = 600 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data from samples.json
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  // Use sample_values, otu_ids, and otu_labels for the barchar
  const individualData = data.samples.find(sample => sample.id === "940");
  const sampleValues = individualData.sample_values.slice(0, 10);
  const otuIds = individualData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
  const otuLabels = individualData.otu_labels.slice(0, 10);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(sampleValues)])
    .range([0, width]);

  const yScale = d3.scaleBand()
    .domain(otuIds)
    .range([0, height])
    .padding(0.1);

  // Create bars
  svg.selectAll(".bar")
    .data(sampleValues)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", (d, i) => yScale(otuIds[i]))
    .attr("width", d => xScale(d))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  // Add labels
  svg.selectAll(".label")
    .data(sampleValues)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d))
    .attr("y", (d, i) => yScale(otuIds[i]) + yScale.bandwidth() / 2)
    .attr("dx", -4)
    .attr("dy", ".35em")
    .text(d => d);

  // Add x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale));

  // Add dropdown menu
  const dropdown = d3.select("body")
    .append("select")
    .on("change", updateChart);

  dropdown.selectAll("option")
    .data(data.names)
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Function to update chart based on selected individual
  function updateChart() {
    const selectedIndividual = dropdown.property("value");
    const newData = data.samples.find(sample => sample.id === selectedIndividual);

    const newSampleValues = newData.sample_values.slice(0, 10);
    const newOtuIds = newData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const newOtuLabels = newData.otu_labels.slice(0, 10);

    xScale.domain([0, d3.max(newSampleValues)]);
    yScale.domain(newOtuIds);

    svg.selectAll(".bar")
      .data(newSampleValues)
      .transition()
      .duration(500)
      .attr("width", d => xScale(d));

    svg.selectAll(".label")
      .data(newSampleValues)
      .transition()
      .duration(500)
      .attr("x", d => xScale(d))
      .text(d => d);

    svg.select(".x.axis")
      .transition()
      .duration(500)
      .call(d3.axisBottom(xScale));
    
    svg.select(".y.axis")
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale)
      .tickSize(0));
  }
});

// Step 3: BUBBLE CHART
// Define dimensions and margins for the chart
const margin2 = { top: 20, right: 20, bottom: 50, left: 50 };
const width2 = 800 - margin2.left - margin2.right;
const height2 = 400 - margin2.top - margin2.bottom;

// Create SVG element for the bubble chart
const svg2 = d3.select("body")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// Load data from samples.json
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  // Extract data for all samples
  const otuIds = data.samples.map(sample => sample.otu_ids).flat();
  const sampleValues = data.samples.map(sample => sample.sample_values).flat();

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(otuIds)])
    .range([0, width2]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(sampleValues)])
    .range([height2, 0]);

  const sizeScale = d3.scaleLinear()
    .domain([0, d3.max(sampleValues)])
    .range([2, 20]); // Adjust according to the desired range of marker sizes

  // Create circles (bubbles)
  svg2.selectAll("circle")
    .data(otuIds)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(otuIds[i]))
    .attr("cy", (d, i) => yScale(sampleValues[i]))
    .attr("r", (d, i) => sizeScale(sampleValues[i]))
    .attr("fill", "steelblue")
    .attr("opacity", 0.7);

  // Add x-axis
  svg2.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg2.append("g")
    .call(d3.axisLeft(yScale));

}).catch(function(error) {
  console.error("Error loading the data:", error);
});

// Step 4
// Load data from samples.json
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  const metadataContainer = d3.select("#sample-metadata")
  
  const metadata = data.metadata.find(item => item.id.toString() === "940");

  // Convert metadata object to an array of key-value pairs
  const metadataEntries = metadata ? Object.entries(metadata) : [];

  // Append each key-value pair to the container
  metadataContainer.selectAll("p")
    .data(metadataEntries)
    .enter()
    .append("p")
    .text(d => `${d[0]}: ${d[1]}`);
});
